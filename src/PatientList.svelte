<script lang="ts">
  import type { Patient } from "fhir/r4";
  import clsx from "clsx";
  import { fhirApi } from "./api";
  //@ts-ignore
  import debounce from "lodash.debounce";

  let page = 0;
  let searchTerm: string = "";
  let patientBundle: any = { entry: [] };
  let loading = false;
  let searchTimeout: number | undefined; // hold timeoute reference

  // ✅ Improved phone number detection
  const isPhoneNumber = (searchTerm: string) => {
    return /^[+\d\s-]{7,15}$/.test(searchTerm.trim()); // Allows numbers with spaces, +, or dashes
  };

  // ✅ Fetch Patients with correct FHIR parameters
  const fetchPatients = async () => {
    loading = true;
    try {
      let searchParams: { telecom?: string; name?: string } = {};

      if (searchTerm.trim()) {
        if (isPhoneNumber(searchTerm)) {
          searchParams.telecom = `${searchTerm.trim()}`;
        } else {
          searchParams.name = searchTerm.trim();
        }
      }

      console.log("Fetching with params:", searchParams);

      const patientResponse = await fhirApi.get(`/Patient`, {
        params: {
          _sort: "-_lastUpdated",
          _count: 20,
          _offset: page * 20,
          ...searchParams,
        },
      });
      if (!patientResponse.data || !patientResponse.data.entry) {
        patientBundle = { entry: [] }; //  Prevents undefined error
      } else {
        patientBundle = patientResponse.data;
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      patientBundle = { entry: [] };
    }
    loading = false;
  };

  const debouncedFetchPatients = debounce(fetchPatients, 300);

  let initialFetchDone = false; // Track if the first fetch has been done

  $: if (!initialFetchDone) {
    fetchPatients();
    initialFetchDone = true; // Prevents infinite loop
  }

  // ✅ Set `page = 0` when user types a new search term
  const handleSearchInput = (event: Event) => {
    searchTerm = (event.target as HTMLInputElement).value;
    page = 0; // Reset page when a new search term is entered

    debouncedFetchPatients();
  };
  // Helper function to format patient names
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
  <input
    bind:value={searchTerm}
    class="w-full border p-2"
    placeholder="Search by name or phone number (exact)"
    on:input={handleSearchInput}
  />

  {#if loading}
    <p class="text-gray-600">Loading...</p>
  {:else if patientBundle.entry?.length}
    <!-- display table -->
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
              <td class="border px-6 py-3">{patient?.resource?.id || "N/A"}</td>
              <td class="border px-6 py-3">{formatName(patient?.resource)}</td>
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
