<script lang="ts">
  export let id: string = "";
</script>

{#if id}
  Patient update: {id}
{:else}
  Patient create to go here
{/if}
