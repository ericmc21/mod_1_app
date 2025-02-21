<script lang="ts">
  export let id: string = "";
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    console.log({ firstName, lastName, birthDate, phoneNumber, gender });

    // TODO: add logic to create fhir resource and post to fhir server
    // show success or fail message from server
  };

  let firstName: string;
  let lastName: string;
  let birthDate: string;
  let phoneNumber: string;
  let gender: string = "no select";
</script>

<h1 class="text-2xl font-semibold mb-10">
  {#if id}
    Updating Patient {id}
  {:else}
    Create Patient
  {/if}
</h1>
<form class="space-y-3 text-left" on:submit={handleSubmit}>
  <div>
    <label for="firstName" class="font-semibod block">First Name</label>
    <input
      bind:value={firstName}
      id="firstName"
      name="firstName"
      class="border p-2"
      required
    />
  </div>
  <div>
    <label for="lastName" class="font-semibod block">Last Name</label>
    <input
      bind:value={lastName}
      id="lastName"
      name="lastName"
      class="border p-2"
    />
  </div>
  <div>
    <label for="gender" class="font-semibod block">Gender</label>
    <select
      bind:value={gender}
      id="gender"
      name="gender"
      class="border p-2"
      required
    >
      <option value="noselect" disabled>Please select an option</option>
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
      class="border p-2"
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
  <div><button class="p-2 bg-black text-white">Submit</button></div>
</form>
