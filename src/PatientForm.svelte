<script lang="ts">
  import { fhirApi } from "./api";
  import type { Patient } from "fhir/r4";
  export let id: string = "";
  const today = new Date().toISOString().split("T")[0];
  let message: any | undefined = undefined;
  let loading = false;
  let patientResource: Patient;

  let patientLoading = false;

  const handleSubmit = async (e: SubmitEvent) => {
    loading = true;
    e.preventDefault();
    console.log({ firstName, lastName, birthDate, phoneNumber, gender });

    let fhirResource: Patient = {
      resourceType: "Patient",
    };
    fhirResource.name = [
      {
        given: [firstName],
        family: lastName,
      },
    ];
    fhirResource.birthDate = birthDate;
    if (phoneNumber) {
      fhirResource.telecom = [
        {
          system: "phone",
          value: phoneNumber,
        },
      ];
    }

    if (gender) {
      fhirResource.gender = gender;
    }

    try {
      if (id) {
        message = await updatePatient(id, fhirResource, patientResource);
      } else {
        message = await createPatient(fhirResource);
      }
    } catch (e: any) {
      message = e?.response.data;
    }
    loading = false;
  };

  const createPatient = async (resource: Patient): Promise<any> => {
    const response = await fhirApi.post("/Patient", resource);
    return response.data;
  };

  const updatePatient = async (
    id: string,
    resource: Patient,
    oldResource: Patient
  ): Promise<any> => {
    console.log(id);
    const response = await fhirApi.put(`/Patient/${id}`, {
      ...oldResource,
      ...resource,
    });
    return response.data;
  };

  const loadPatient = async (id: string) => {
    const patientResponse = await fhirApi.get<Patient>(`/Patient/${id}`);
    const patientResource = patientResponse.data;
    const name = patientResource.name?.[0];

    if (name?.given?.[0]) {
      firstName = name?.given?.[0];
    }

    lastName = name?.family;

    if (patientResource.birthDate) {
      birthDate = patientResource.birthDate;
    }

    if (patientResource.gender) {
      gender = patientResource.gender;
    }

    const phoneContactPoint = patientResource.telecom?.find(
      (a) => a.system == "phone"
    );
    if (phoneContactPoint) {
      phoneNumber = phoneContactPoint.value;
    }

    return patientResource;
  };

  let firstName: string;
  let lastName: string | undefined;
  let birthDate: string;
  let phoneNumber: string | undefined;
  let gender: "other" | "male" | "female" | "unknown" | undefined = undefined;

  $: if (id) {
    patientLoading = true;
    loadPatient(id).then((resource) => {
      patientResource = resource;
      patientLoading = false;
    });
  }
</script>

<h1 class="text-2xl font-semibold mb-10">
  {#if id}
    Updating Patient {id}
  {:else}
    Create Patient
  {/if}
</h1>
{#if patientLoading}
  Loading...
{:else}
  <form class="space-y-3 text-left" on:submit={handleSubmit}>
    <div>
      <label for="firstName" class="font-semibod block">First Name</label>
      <input
        bind:value={firstName}
        id="firstName"
        name="firstName"
        class="border p-2 w-full"
        required
      />
    </div>
    <div>
      <label for="lastName" class="font-semibod block">Last Name</label>
      <input
        bind:value={lastName}
        id="lastName"
        name="lastName"
        class="border p-2 w-full"
      />
    </div>
    <div>
      <label for="gender" class="font-semibod block">Gender</label>
      <select
        bind:value={gender}
        id="gender"
        name="gender"
        class="border p-2 w-full"
        required
      >
        <option value={undefined} disabled>Please select...</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div>
      <label for="birthDate" class="font-semibod block">Date of Birth</label>
      <input
        bind:value={birthDate}
        id="birthDate"
        name="birthDate"
        type="date"
        max={today}
        class="border p-2 w-full"
        required
      />
    </div>
    <div>
      <label for="phoneNumber" class="font-semibod block">Phone Number</label>
      <input
        bind:value={phoneNumber}
        id="phoneNumber"
        name="phoneNumber"
        type="tel"
        class="border p-2 w-full rounded-md"
        required
        pattern="\d\d\d\d\d\d\d\d\d\d"
        title="Phone number"
        placeholder="Enter phone number"
      />
    </div>
    <div>
      <button class="p-2 bg-black text-white"
        >{#if loading}
          Loading...
        {:else if id}
          Update
        {:else}
          Create
        {/if}
      </button>
    </div>
  </form>
{/if}

<pre>
  {#if message}
    Status: 
    {JSON.stringify(message)}
  {/if}
</pre>
