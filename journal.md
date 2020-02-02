# Journal

## Impostazione progetto
- Il progetto è stato scritto in javascript modulare, questo per facilitare la collaborazione tra gli sviluppatori e per rendere più chiaro e leggibile il codice.

## Design
- E' stato deciso di personalizzare il modello di un iPhone XS.
- Principalmente l'iPhone si compone di materiali metallici: la scocca posteriore, i bordi laterali, il rilievo delle fotocamere dietro.
- I pulsanti si comportano in maniera completamente diffusiva.
- Lo schermo si comporta come uno specchio ideale.

## Storico
- 2020-01-03 / 2020-01-09: impostato il progetto, scelto il modello.
- 2020-01-08: aggiunto jQuery.
- 2020-01-09 / 2020-01-15: impostato lo shader "glossy", costruzione del menu per la scelta di texture e colori.
- 2020-01-15 / 2020-01-30: impostato lo shader "mirror-like" e "diffuse", selezionate le texture da applicare alla scocca del telefono.
- 2020-01-30/ 2020-02-02: costruzione del sito, risoluzione problemi, refactor del codice.

## Principali problemi
- La scocca del telefono non presentava le coordinate UV per l'applicazione delle texture, è stato necessario derivarle in js.
- Alcune mesh dopo il caricamento del modello presentavano dei problemi nei valori di scalature e posizioni. Questi problemi durante le trasformazioni portavano a null i valori della posizione facendo scomparire le mesh. Per risolverli è stato necessario analizzare i valori delle altre mesh presenti nel modello e cercare di dare alle mesh "danneggiate" dei valori verosimili analizzando quelle corrette.
- Il caricemnto in real-time delle texture risulta lento per cui si è deciso di mantenere una struttura in memoria con tutte le texture della scossa e dell'ambiente.

## Strumenti utilizzati
- Blender per l'analisi del modello.
- Git-flow per il revisionamento del codice in modo da lavorare simultanemante su porzioni diverse del progetto.