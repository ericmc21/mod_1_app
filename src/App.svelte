<script lang="ts">
  import PatientList from "./PatientList.svelte";
  import PatientForm from "./PatientForm.svelte";
  import { Router, Link, Route } from "svelte-routing";
</script>

<Router>
  <main>
    <div
      class="w-full md:max-w-6xl md:mx-auto bg-white shadow-md rounded-lg p-6"
    >
      <Route path="/"><PatientList></PatientList></Route>
      <Route path="/patient"><PatientForm></PatientForm></Route>
      <Route path="/patient/:id" component={PatientForm}>e</Route>
    </div>
  </main>
</Router>
