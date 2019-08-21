<template>
  <div class="about">
    <tryComp a="Ich habe die Idee verstanden, mit Komponenten zu arbeiten!!!">
    </tryComp>
  </div>
</template>

<script>
// @ is an alias to /src
import tryComp from "@/components/tryComp.vue";

export default {
  name: "about",
  components: {
    tryComp
  }
};
</script>
