<script lang="ts">
  import axios from "axios";
  const fhirBAseUrl = "https://hapi.fhir.org/baseR4";

  const fetchPatients = async () => {
    const patientResponse = await axios.get(`${fhirBAseUrl}/Patient`);
    const patients = patientResponse.data;
    console.log({ patients });
    return patients;
  };
</script>

<main>
  <div class="max-w-md mx-auto my-10">
    <h1 class="text-2xl font-semibold">Patients on the Server</h1>
    {#await fetchPatients()}
      loading...
    {:then patientBundle}
      {#each patientBundle.entry as patient}
        <p>
          {patient?.resource?.id}, {patient?.resource?.name?.[0]?.given?.[0]}, {patient
            ?.resource?.name?.[0]?.family}
        </p>
      {/each}
    {/await}
  </div>
</main>
