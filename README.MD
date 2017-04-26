WalkingEa
=========

![Animation](http://i.imgur.com/yy7HWTG.gif)


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


### 2

### Tweaking
Hva tingene er

### Bonus

* Finn andre former for parent selection og implementer disse.

* Legg til en ny figur ved å utvide `creatureDefinitions.js`. `Points` er koordinater til punktene, mens `edges` er indekser til punkter som skal kobles sammen. 
Navnet du gir figuren må også legges til i dropdownen i `index.html`

* Prøv å evolve en figur der målet er å hoppe høyest mulig. Må da endre på `creature.js` til at den finner max distanse i y-retning og ikke x.
Må nok også tweake verdiene i `jointDef` i samme fil for å gjøre musklene mer "spretne". Kan øke hz og minske damping.

* Bruk EAen til å løse et annet problem. F. eks. "onemax" som går ut på å få et array til å bare inneholde 1-ere. 
Da må man kalle runEA med en ny funksjon for å generere random individer, og nok bytte ut flyttall-mutasjonen med en som flipper bits, og sende inn en
fitness funksjon som gir score basert på antall 1-ere.
