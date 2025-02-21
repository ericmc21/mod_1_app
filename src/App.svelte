<script lang="ts">
  import axios from "axios";
  import type { Patient } from "fhir/r4";
  import clsx from "clsx";

  const fhirBaseUrl = "https://hapi.fhir.org/baseR4";

  let page = 0;
  const fetchPatients = async (page: number) => {
    try {
      const patientResponse = await axios.get(`${fhirBaseUrl}/Patient`, {
        params: { _sort: "_lastUpdated", _count: 20, _offset: page * 20 },
      });
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

  {#await fetchPatients(page)}
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
  <div class="mt-4">
    <button
      class={clsx("p-2 text-white", {
        "bg-black": page !== 0,
        "bg-gray-300": page === 0,
      })}
      on:click={() => page--}
      disabled={page === 0}>Previous</button
    >
    <button class="p-2 bg-black text-white" on:click={() => page++}>Next</button
    >
  </div>
</main>
