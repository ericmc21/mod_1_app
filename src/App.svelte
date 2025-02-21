<script lang="ts">
  import axios from "axios";
  import type { Patient } from "fhir/r4";

  const fhirBaseUrl = "https://hapi.fhir.org/baseR4";

  const fetchPatients = async () => {
    try {
      const patientResponse = await axios.get(`${fhirBaseUrl}/Patient`);
      return patientResponse.data;
    } catch (error) {
      console.error("Error fetching patients:", error);
      return { entry: [] };
    }
  };

  const formatName = (resource: Patient) => {
    const nameElement = resource.name?.[0];
    const firstName = nameElement?.given?.join(" ") || "";
    const lastName = nameElement?.family || "";

    return `${firstName} ${lastName}`.trim() || "Unknown";
  };
</script>

<main class="max-w-4xl mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
  <h1 class="text-2xl font-semibold mb-4 text-gray-700">
    Patients on the Server
  </h1>

  {#await fetchPatients()}
    <p class="text-gray-600">Loading...</p>
  {:then patientBundle}
    {#if patientBundle.entry?.length}
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-200 text-left">
              <th class="border border-gray-300 px-4 py-2">ID</th>
              <th class="border border-gray-300 px-4 py-2">Name</th>
              <th class="border border-gray-300 px-4 py-2">Gender</th>
              <th class="border border-gray-300 px-4 py-2">Birth Date</th>
            </tr>
          </thead>
          <tbody>
            {#each patientBundle.entry as patient (patient.resource.id)}
              <tr class="border border-gray-300 hover:bg-gray-100">
                <td class="border px-4 py-2"
                  >{patient?.resource?.id || "N/A"}</td
                >
                <td class="border px-4 py-2">{formatName(patient?.resource)}</td
                >
                <td class="border px-4 py-2 capitalize"
                  >{patient?.resource?.gender || "Unknown"}</td
                >
                <td class="border px-4 py-2"
                  >{patient?.resource?.birthDate || "Not available"}</td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <p class="text-gray-600">No patients found.</p>
    {/if}
  {/await}
</main>
