WalkingEa
=========

Try it out: https://matsemann.github.io/walkingea/

![Animation](eagif4.gif?raw=true)


To run

```
npm install
npm run server
```

Open http://localhost:8080 in your browser


OPPGAVE
-------

Vi har laget en simulator og en basic EA-loop. Loopen kaller stort sett bare på et sett funksjoner, som dere må implementere.
I hovedsak fila `walkerEaRunner.js` det skal endres i. Målet er å skrive kode som klarer å avle frem individer som har lært å gå.

### Oppgave 1

I simulatoren ser dere nå bare en enslig stakkar. Vi trenger derimot en hel populasjon, så første oppgave går ut på å opprette flere individer. 

* Endre på `generatePopulationFunction()` slik at den returnerer like mange individer som man har satt `population size` til.
* Gi hvert individ tilfeldige gener. Genene i vårt tilfelle er et array med (flyt)tall mellom 0 og 1, der antallet elementer bestemmes utifra hvilken figur som utvikles.
* Når oppgaven er løst skal man ved en refresh av nettleseren se flere individer (fordel på de forskjellige etasjene) som beveger seg i tilfeldige spasmer

Bevegelsene til individene baseres på genene. Hvert tall i genet tilhører en muskel (kant), og styrer frekvensen/sinusfunksjonen som denne trekker seg sammen i. Gyldig verdi per tall er domenet [0, 1]


### Oppgave 2

Neste steg er å gi hvert individ en score basert på hvor bra det gjorde det. Output fra simuleringen er en liste med verdier, der hver verdi tilhører et individ.
Denne verdien er igjen en liste, med posisjonshistorikken per sekund for det individet igjennom simuleringen.

Det er mange måter å beregne fitness på basert på denne historikken. Man kan score individene basert på sluttposisjon, på lengste distanse de noensinne oppnådde,
på hvor jevnt de beveget seg, trekke dem i score for å ha beveget seg bakover osv. Lønner seg å begynne simpelt, og heller komme tilbake og justere scoringen senere.

* I `fitnessFunction`, sett `fitness`-verdien på hvert individ basert på resultatene fra simuleringen.
* Når dette er gjort skal man etter en iterasjon (60 simulerte sekunder) se grafen oppdatere seg.


### Oppgave 3
Nå som alle individene har en score kan man velge hvem som skal få parre seg. Om man alltid velger de beste får man en grådig algoritme
som fort kan bli stuck, så vi ønsker at de dårlige løsningene skal ha en sjanse, men at de gode løsningene skal ha en *større* sjanse.

Det finnes flere algoritmer man kan implementere. Et tips er å implementere dem i hver sin funksjon, og så kan man lett bytte hvilken som 
brukes ved å sende forskjellig funksjon inn til selve EAen.

Som input får man listen over alle individer, med `fitness`-verdien satt. Det man skal returnere er en liste med `populationSize` antall individer.
Så man velger ut ett og ett individ basert på en av algoritmene under, helt til man har nok. Samme individ kan plukkes ut flere ganger.

* Fitness-proportionate selection.
 1. Normaliser fitness-verdiene til individene (slik at fitness-verdiene for alle individer summerer til 1)
 2. Lag et array ("Roulettehjul") med verdier fra 0 til 1, der hvert individ blir tildelt like stor del av arrayet som den normaliserte fitnessen deres tilsvarer. (`rouletteWheel[i] = rouletteWheel[i -1] + [normalisert fitness-verdi for individ i]`)
 3. Spinn roulettehjulet for å velge et individ. (Lag et tilfeldig tall X mellom 0 og 1 og velg individet som befinner seg i `rouletteWheel[i] > X`)

* Tournament selection
 1. Justeres med to verdier: k og p
 2. Trekk ut k tilfeldige individer fra populasjonen
 3. Med sannsynlighet p, velg individet med best fitness score
 4. Med sannsynlighet p*(1-p)^(n-1), velg individet med n-te best fitness
 
* Simple tournament selection
 1. Trekk ut k tilfeldige individer fra populasjonen
 2. Velg individet med best fitness av disse
 3. Denne kan ikke justeres/tweakes i like stor grad
 
* Andre algoritmer
 1. Sigma scaling, gir mye variasjon i starten og senere mer målrettet, som kan være nyttig
 2. Truncation selection
 3. Rank selection
 
* Implementer en av algoritmene nevnt over inne i `parentSelectionFunction`
* Når dette er gjort skal man etter noen generasjoner se en trend at man har fått bedre individer. Snittscoren i grafen bør ha økt fra det den var i starten.


### Oppgave 4

Crossover er der selve "paringen" skjer. Funksjonen får inn to individer, og har mulighet til å mikse deres DNA.

* Gjøres i funksjonen `crossoverFunction`.
* Først må man finne ut om de skal mikses eller ikke. Gjøres ved å generere et tilfeldig tall (mellom 0 og 1) og sjekke om det er mindre enn `crossoverRate` som har blitt valgt.
* Om tilfeldighetene sier at en crossover skal gjøres, gjøres det ved å velge en tilfeldig index i individene sitt gen, og bytte/swappe alle verdiene i genet etter denne indeksen.


### Oppgave 5

Mutasjonen er der man har mulighet til å innføre nye "egenskaper" i populasjonen. Det gjøres ved å gjøre justeringer på genet til individene.

I hovedsak to måter å gjøre mutasjon på: per verdi, eller på genet som helhet
* Førstnevnte itererer man over hver verdi i genet, og for hver verdi trekker man et tilfeldig tall og sammenligner med `mutationRate`. Om det skal muteres, muterer man den verdien.
* Nummer 2, som er den mest vanlige, er at man finner ut om man skal mutere eller ikke. Skal man mutere, gjøres det ved å velge en tilfeldig verdi i genet og mutere denne.

Forskjellen på disse to er at den første har mulighet til å endre flere verdier i samme mutasjon, og kan dermed raskere utvikle spennende egenskaper.
Samtidig står man også i fare for at for store endringer ødelegger individet man muterer, så en tradeoff der. Bruker man den først er `mutationRate` per verdi,
i genet og bør derfor være lav. Bruker man nummer 2 er `mutationRate` per individ, og kan da være en del høyere.

Når en muterer verdien er det igjen flere måter å gjøre det på (når genet er flyttall):
* Bare bytte ut verdien med en ny, tilfeldig verdi mellom 0 og 1. Kan bli en større endring, på godt og vondt.
* Trekke fra/legge til en litt mindre, tilfeldig verdi.
* Legge til en tilfeldig, normalfordelt verdi rundt 0. Ofte denne som brukes i praksis da endringen i snitt er liten, men med en liten sannsynlighet for større endringer. `Rnd2` her gir et godt eksempel på hvordan lage et normalfordelt tall: http://jsfiddle.net/Guffa/tvt5K/

Mutasjon får inn ett individ. Det er to måter å bruke mutationRate på:
* Om et tilfeldig tall er under mutationRate, muterer vi en tilfeldig verdi i arrayet til individet. Da har man typisk en høy mutation rate.
* For hver verdi i arrayet til individet trekker vi et tilfeldig tall og sjekker om det er under mutationRate, i så fall muterer vi den posisjonen i arrayet. Her kan man altså kanskje få flere mutasjoner på samme individ. Har typisk en veldig lav mutation rate, da den nå gjelder per verdi.

Husk at verdiene i genet bare er mellom 0 og 1, så etter en verdi er mutert må man passe på at det fortsatt gjelder.

### Oppgave 6
For adult-selection kjører vi foreløbig en "full generational replacement", altså at alle foreldre dør og blir erstattet av barna.
Men det kan være lurt å la et par av de beste foreldrene få overleve. Dette sikrer at det beste individet i en generasjon ikke er dårligere enn det var i forrige generasjon,
og at man ikke mister de beste genkombinasjonene man har produsert så langt. Dette kalles for "elitisme".

* I `adultSelectionFunction`, plukk ut noen få av de beste fra `oldPopulation` og returner de sammen med barna (`concat` funksjonen i javascript).
* Når dette er gjort bør max fitness per generasjon aldri synke, da noen av de beste alltid blir med videre.

### Tweaking

Å skrive koden er bare 10% av det å lage en evolusjonær algoritme, da det er masse tweaking for å få den god. Her er noe av det som kan justeres:

* `Mutation rate` kan være lurt å ha litt høy, da det er den som innfører nye egenskaper til populasjonen. Samtidig kan for høy mutasjon komme i veien og ødelegge for gode individer.

* `Crossover rate` er også viktig en viktig faktor. Ikke gitt at det å kombinere to foreldre gir gode avkom. Får man etter hvert mange like individer kan det være at crossover- og mutation rate er for lave.

* `Population`, en større populasjon gir større mangfold som kan gi bedre løsninger. Men det gjør også algoritmen tregere.

* `Elitism` / adult-selection, det er ofte lurte å kopiere over noen av de beste fra hver generasjon, men kopierer man over for mange av de gode mister man mangfoldet og får en grådig algoritme som kan bli stuck.

* `Mutasjon`, nevnt flere måter å gjøre mutasjon på som kan testes

* `Parent-selection`, flere forskjellige måter å gjøre det på. I tillegg har f. eks. Tournament Selection to parametre som kan justeres,
som avgjør sannsynligheten for å velge den beste løsningen eller om en dårligere en skal bli valgt for å bevare mangfoldet. Refereres ofte til
"selection pressure". For høy pressure gjør at bare gode individer velges, for lav at for mange dårlige blir med videre, så trikset er å 
tweake denne masse. Et tegn på for lav selection pressure kan være at average-fitness ikke øker særlig på sikt.

* `Fitness-funksjonen`, her er det ofte mye tweaking for å belønne egenskaper som kan lønne seg på sikt.


### Bonus

* Prøv å lære noen av de andre figurene å gå.

* Legg til en ny figur ved å utvide `creatureDefinitions.js`. `Points` er koordinater til punktene, mens `edges` er indekser til punkter som skal kobles sammen. 
Navnet du gir figuren må også legges til i dropdownen i `index.html`

* Implementer en ny form for parent selection.

* Lek deg med simulatoren. F. eks. justere på verdiene i `jointDef` i `creature.js`.

* Jeg har lagt ved en pdf som heter `oving2.pdf`. I denne finner man 3 problemer: One-Max, LOLZ og Surprising Sequences.
EAen er så generell at den kan gjenbrukes til å løse alle mulige problemer, så prøv å løse noen av disse ved å kalle `runEA` med funksjoner relatert til disse problemene.
Parent selection, crossover og slik kan nok gjenbrukes, men mutation må nok byttes ut med en som ikke er beregnet på flyttall, fitness funksjonen må omskrives spesifikt per problem, og funksjonen
som genererer populasjonen må også byttes ut til problemet.

