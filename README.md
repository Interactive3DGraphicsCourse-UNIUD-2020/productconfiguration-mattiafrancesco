# ACME iPhone configurator

Il progetto permette di personalizzare alcune caratteristiche di un iPhone e di vedere il comportamento di queste personalizzazioni in alcune condizioni ambientali.

Il progetto, oltre a three.js, utilizza anche jQuery.

## File e cartelle

Di seguito si può trovare un breve elenco del contenuto dei vari file e delle varie cartelle.

### Cartelle

* `build` e `jsm`: file e moduli delle librerie usate
* `images`: immagini del sito statico, quindi anteprima e loghi
* `model`: file Blender e GLTF del modello
* `References`: file JavaScript che contengono costanti per facilitare la scrittura del codice
  - `ColorNames.js`: costanti che definiscono dei colori
  - `MeshesNames.js`: costanti associate ai nomi delle varie mesh
  - `ParamsNames.js`: costanti associate ai vari parametri degli shader
  - `ShadersNames.js`: costanti associate ai vari shader
  - `TextureNames.js`: costanti che contengono i path delle texture
* `shaders`: come intuibile contiene i vari shader del progetto
  - `back_cover`: per i materiali della cover posteriore dell'iPhone
  - `diffuseRef`: per le riflessioni diffusive
  - `envLightReflect`: per le riflessioni dell'ambiente
  - `glossyRef`: per le riflessioni speculari
  - `screen`: per lo schermo dell'iPhone e la luminosità
* `textures`: tutte le texture applicate al modello

### File

* `Engine.js`: classe che si occupa di inizializzare three.js e della main loop
* `Group.js`: alias di Object3D
* `GUI.js`: classe che crea i vari menù con le rispettive callback
* `index.html`: file principale
* `Menu.js`: classe che modella un singolo menù
* `MenuItem.js`: classe che modella una voce del menù
* `Model.js`: qui avviene il caricamento del modello
* `Products.js`: classe che crea dinamicamente la lista dei prodotti visualizzati nel sito
* `Shader.js`: classe addetta al caricamento degli shader
* `ShaderParams.js`: classe che permette di modificare dinamicamente i parametri passati agli shader
* `style.css`: foglio di style
* `utils.js`: file che contiene funzioni di vario tipo
* `World.js`: classe che inizializza la scena