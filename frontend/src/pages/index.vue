<script setup lang="ts" generic="T extends any, O extends any">
defineOptions({
  name: 'IndexPage',
})

const images = [
  "/ALICE.png",
  "/CIRKLA.png",
  "/EPFL.png",
  "/EthZurich.png",
  "/FGS.png",
  "/IGP.png",
  "/LUMA.png",
  "/MATERIALARCHIV.png",
  "/MATERIAUTHEQUE.png",
  "/Opalis.png",
  "/ROTOR_DC.png",
  "/SUPSI.png",
]

</script>

<template>
  <div>
    <h2 class="title">
      <a rel="noreferrer" href="https://github.com/EPFL-ENAC/alice-ethz-arema" target="_blank">
        Atlas of regenerative materials
      </a>
    </h2>

    <p class="mt-2 mb-2">This project aims to be an open repository of knowledge about all currently available resources for sustainable construction.</p>
    <p class="mt-2 mb-2">
      This includes information about:
      <ul>
        <ol> natural resources, gathered from various scientific or governmental databases, geolocalized,</ol>
        <ol> building materials made out of the former, including specifications, gathered by experts,</ol>
        <ol> professionals working in the sector, from architect to craftsman and supplier, with specific geographic information about the latter's sourcing,</ol>
        <ol> technical construction details explaining how a given building material is to be used for a specific building element (e.g. wall, insulation, finishing...)</ol>
        <ol> buildings where sustainable construction is implemented, how it is done and where the used materials were sourced.</ol>
      </ul>
    </p>
    <p class="mt-2 mb-2">
      If available, additional information can be supplemented to the mere practical information such as anthropological, historical and anecdotal tidbits in the shape of text, audio or video content.
    </p>
    <p class="mt-2 mb-2">
      These ambitious but thorough procedure will need the contributions from academic and industrial experts, thus fostering active cooperations and networks both locally and internationally. All data entries will be curated to ensure high quality standards according to the Charta of the project.
    </p>
    <p class="mt-2 mb-2">
      The atlas of regenerative materials will provide academia with valuable teaching support, the construction community with a ready to use database and third parties with additional insight into practices which provide a sustainable and comprehensive alternative to the current depletion of fossil or/and finite resources in the sector.
    </p>
    <p class="mt-2 mb-2">
      Partners:
      <ul>
        <ol>
          Prof. Dr. Guillaume Habert & Shoshana Huber, Chair of sustainable construction, ETH Zürich
        </ol>
        <ol>
          Alia Bengana, Alice Laboratory, EPF Lausanne
        </ol>
      </ul>
    </p>

    <p>
      <ul>

      
<li>Materialarchiv.ch, Joachim Markus</li>
<li>Opalis & RotorDC, Michael Gyhoot</li>
<li>Cirkla & Salza, Olivier De Perrot</li>
<li>Supsi, Dr. Stefano Zerbi</li>
<li>Georesources Switzerland Group ETHZ, Dr. Stefan Heuberger</li>
<li>La matériauthèque MATILDA, Audanne Comment</li>
<li>IBOIS, Yves Weinand</li>
<li>IGP ETHZ, Dr. Konrad Schindler</li>
</ul>
<ul>
  <li>Web Dev by IT4R at EPFL</li>
</ul>
<ul>
<li>Students ETHZ: Mathieu Lecaille, Despoina Minakaki, Emma Livio, Timon Voide</li>
<li>Course: EPFL Alice PENS 320 Territoires des matières durables, Alia Bengana, Florence Graezer Bideau </li>
</ul>

    </p>

    <p class="grid-images">
      <v-img :src="image"  :width="252" :max-width="252"
  aspect-ratio="1"
  inline
   v-for="image in images">

      </v-img>
    </p>
  </div>
</template>

<style>
.grid-images {
  display: grid;
        grid-template-columns: repeat(auto-fill, 252px);
        justify-content: center;
        grid-auto-rows: fit-content(150px);

}</style>
