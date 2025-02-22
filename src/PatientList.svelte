<script lang="ts">
  import type { Patient } from "fhir/r4";
  import clsx from "clsx";
  import { fhirApi } from "./api";

  let page = 0;
  const fetchPatients = async (page: number) => {
    try {
      const patientResponse = await fhirApi.get(`/Patient`, {
        params: { _sort: "-_lastUpdated", _count: 20, _offset: page * 20 },
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

<main
  class="max-w-6xl w-full px-4 md:px-8 mx-auto my-10 p-6 bg-white shadow-md rounded-lg"
>
  <p class="mb-2">
    <a class="p-2 bg-black text-white rounded-md" href="/patient"
      >Create Patient</a
    >
  </p>
  <h1 class="text-2xl font-semibold mb-4 text-gray-700">
    Patients on the Server
  </h1>

  {#await fetchPatients(page)}
    <p class="text-gray-600">Loading...</p>
  {:then patientBundle}
    {#if patientBundle.entry?.length}
      <div class="overflow-x-auto">
        <table
          class="w-full border-collapse border border-gray-300 min-w-[800px]"
        >
          <thead>
            <tr class="bg-gray-200 text-left">
              <th class="border border-gray-300 px-6 py-3">ID</th>
              <th class="border border-gray-300 px-6 py-3">Name</th>
              <th class="border border-gray-300 px-6 py-3">Gender</th>
              <th class="border border-gray-300 px-6 py-3">Birth Date</th>
            </tr>
          </thead>
          <tbody>
            {#each patientBundle.entry as patient (patient.resource.id)}
              <tr
                on:click={() =>
                  (window.location.href = `/patient/${patient?.resource?.id}`)}
                class="border border-gray-300 hover:bg-gray-100 cursor-pointer"
              >
                <td class="border px-6 py-3"
                  >{patient?.resource?.id || "N/A"}</td
                >
                <td class="border px-6 py-3">{formatName(patient?.resource)}</td
                >
                <td class="border px-6 py-3 capitalize"
                  >{patient?.resource?.gender || "Unknown"}</td
                >
                <td class="border px-6 py-3"
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

  <div class="mt-6 flex justify-center space-x-4">
    <button
      class={clsx("px-4 py-2 text-white rounded-md", {
        "bg-black hover:bg-gray-800": page !== 0,
        "bg-gray-300 cursor-not-allowed": page === 0,
      })}
      on:click={() => page--}
      disabled={page === 0}
    >
      Previous
    </button>
    <button
      class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
      on:click={() => page++}
    >
      Next
    </button>
  </div>
</main>
