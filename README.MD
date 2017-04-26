WalkingEa
=========

![Animation](eagif4.gif?raw=true)


To run

```
npm install
npm run server
```

Open http://localhost:8080 in your browser


OPPGAVE
-------

Vi har laget en simulator og en basic EA-loop.
Deres oppgave er å lage resten av EA-algoritmen, slik
at strekfigurene lærer å gå.

Phenotypen/DNAet er i dette tilfellet et array med flyttallsverdier/floats.
Antall verdier tilsvarer antall kanter på strekfiguren. Gyldig domene for tallene er 0 til 1.
Tallene i phenotypen brukes i simulatoren for å kontrollere sinusfunksjonen som trekker "musklene" sammen.


Det er i hovedsak fila `walkerEaRunner.js` det skal endres i. Skjellettet er fylt ut slik at simulatoren allerede kjører i det man begynner.

### 1
Når man har en ferdig evolusjonær algoritme, er det egentlig bare to funksjoner som er spesifikke for problemet man trenger å sende inn til algoritmen:

* En funksjon som genererer tilfeldige løsninger. Den har dere allerede fått, den lager tilfeldige tall i et array.
* En fitness-funksjon som tar inn løsninger og gir dem en score. I vårt tilfelle innebærer det å teste hver løsning i simulatoren.
Simulatoren returnerer et array, der hvert element består av to verdier: `maxDst` lengste distanse individet kom, `distance` hvor individet var når simuleringen var ferdig.
Bruk disse verdiene for å gi individene en score. Hvordan du scorer dem er opp til deg. Scorene blir printet i `console` etter hver iterasjon, så sjekk der at det dukker opp noe fornuftig.


### 2
Nå som alle individene har en score kan man velge hvem som skal få parre seg. Om man alltid velger de beste får man en grådig algoritme
som fort kan bli stuck, så vi ønsker at de dårlige løsningene skal ha en sjanse, men at de gode løsningene skal ha en større sjanse.

Det finnes flere algoritmer man kan implementere. Et tips er å implementere dem i hver sin funksjon, og så kan man lett bytte hvilken som 
brukes ved å sende forskjellig funksjon inn til selve EAen.

Som input får man to arrays, der fitness-verdi nr X tilhører individ nr X. F. eks er `fitnesses[2]` fitnessen til `population[2]`. Funksjonen 
skal returnere en liste over individer som er plukket ut til å bli foreldre. Samme individ kan forekomme flere ganger. Listen skal inneholde `populationSize` antall individer.

* Fitness-proportionate selection.
 1. Normaliser fitness-verdiene til individene (slik at fitness-verdiene for alle individer summerer til 1)
 2. Lag et array ("Roulettehjul") med verdier fra 0 til 1, der hvert individ blir tildelt like stor del av arrayet som den normaliserte fitnessen deres tilsvarer. (`rouletteWheel[i] = rouletteWheel[i -1] + [normalisert fitness-verdi for individ i]`)
 3. Spinn roulettehjulet for å velge et individ. (Lag et tilfeldig tall X mellom 0 og 1 og velg individet som befinner seg i `rouletteWheel[i] > X`)

* Tournament selection
 1. Justeres med to verdier: k og p
 2. Trekk ut k tilfeldige individer fra populasjonen
 3. Med sannsynlighet p, returner individet med best fitness score
 4. Med sannsynlighet p*(1-p)^(n-1), returner individet med n-te best fitness

Når fitness-funksjonen og en parent-selection er på plass skal man oppleve en svak trend der individene blir bedre for hver generasjon.

### 3
Crossover-funksjonen får inn to individer. Man genererer først et tilfeldig tall, og om det tallet er mindre enn crossoverRate skal man gjøre en crossover.
For å gjøre en crossover velger man en tilfeldig index i individene sitt array, og bytter alle verdiene før eller etter denne indeksen mellom arrayene.

### 4
Mutasjon får inn ett individ. Det er to måter å bruke mutationRate på:
* Om et tilfeldig tall er under mutationRate, muterer vi en tilfeldig verdi i arrayet til individet. Da har man typisk en høy mutation rate.
* For hver verdi i arrayet til individet trekker vi et tilfeldig tall og sjekker om det er under mutationRate, i så fall muterer vi den posisjonen i arrayet. Her kan man altså kanskje få flere mutasjoner på samme individ. Har typisk en veldig lav mutation rate, da den nå gjelder per verdi.

Og igjen er det flere måter å mutere på:
* Bytt ut verdien med en ny tilfeldig verdi mellom 0 og 1. Dette kan bli en veldig stor endring.
* Generer et tilfeldig, lite tall og legg til eller trekk det fra den eksisterende verdien. Gir typisk en veldig liten endring.
* Generer et tilfeldig, normalfordelt tall rundt 0 og legg det til den eksisterende verdien. Gir som regel en liten endring, men med mulighet for større mutasjoner en gang i blant.
`Rnd2` her gir et godt eksempel på hvordan lage et normalfordelt tall: http://jsfiddle.net/Guffa/tvt5K/

Pass på at den muterte verdien fortsatt er mellom 0 og 1 etter mutasjonen.

### 5
For adult-selection kjører vi foreløbig en "full generational replacement", altså at alle foreldre dør og blir erstattet av barna.
Men det kan være lurt å la et par av de beste foreldrene få overleve. Dette sikrer at det beste individet i en generasjon ikke er dårligere enn det var i forrige generasjon,
og at man ikke mister de beste genkombinasjonene man har produsert så langt. Dette kalles for "elitisme".

Så i tillegg til å returnere barna som det gjøres nå, finn et par av de beste foreldrene basert på `oldFitnesses` og legg de til (`concat`) på listen før den returneres.


### Tweaking

Å skrive koden er bare 10% av det å lage en evolusjonær algoritme, da det er masse tweaking for å få den god. Her er noe av det som kan justeres:

* `Mutation rate` kan være lurt å ha litt høy, da det er den som innfører nye egenskaper til populasjonen.

* `Crossover rate` er også viktig, men ikke alle kombinasjoner av foreldre gir fornuftige avkom, så den bør ofte ikke være alt for høy.

* `Population`, en større populasjon gir større mangfold som kan gi bedre løsninger. Men det gjør også algoritmen tregere.

* `Elitism` / adult-selection, det er ofte lurte å kopiere over noen av de beste fra hver generasjon, men kopierer man over for mange av de gode mister man mangfoldet og får en grådig algoritme som kan bli stuck.

* `Mutasjon`, nevnt flere måter å gjøre mutasjon på som kan testes

* `Parent-selection`, flere forskjellige måter å gjøre det på. I tillegg har f. eks. Tournament Selection to parametre som kan justeres,
som avgjør sannsynligheten for å velge den beste løsningen eller om en dårligere en skal bli valgt for å bevare mangfoldet.

* `Fitness-funksjonen`, her er det ofte mye tweaking. I vårt tilfelle nå har vi bare to verdier å forholde oss til.

* `Figure`, forskjellige figurer som man kan prøve å lære og gå. 


### Bonus

* Finn andre former for parent selection og implementer disse.

* Legg til en ny figur ved å utvide `creatureDefinitions.js`. `Points` er koordinater til punktene, mens `edges` er indekser til punkter som skal kobles sammen. 
Navnet du gir figuren må også legges til i dropdownen i `index.html`

* Prøv å evolve en figur der målet er å hoppe høyest mulig. Må da endre på `creature.js` til at den finner max distanse i y-retning og ikke x.
Må nok også tweake verdiene i `jointDef` i samme fil for å gjøre musklene mer "spretne". Kan øke hz og minske damping.

* Bruk EAen til å løse et annet problem. F. eks. "onemax" som går ut på å få et array til å bare inneholde 1-ere. 
Da må man kalle runEA med en ny funksjon for å generere random individer, og nok bytte ut flyttall-mutasjonen med en som flipper bits, og sende inn en
fitness funksjon som gir score basert på antall 1-ere.
