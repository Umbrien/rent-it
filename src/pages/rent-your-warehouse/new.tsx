import { useState } from "react";
import { useRouter } from "next/router";
import { AuthInput } from "@/components/auth/Input";
import { WarehouseTypesFilter } from "@/components/warehouse/WarehouseTypesFilter";
import { api } from "@/utils/api";

const NewWarehouse = () => {
  const router = useRouter();
  const { type } = router.query;

  const [nameUk, setNameUk] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [addressUk, setAddressUk] = useState("");
  const [dailyRate, setDailyRate] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const mutation = api.authed.addWarehouse.useMutation({
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (err) => {
      setError(err.message);
    },
    onMutate: () => {
      setSuccess(false);
      setError("");
    },
  });

  const handleSubmit = async () => {
    await mutation.mutateAsync({
      nameUk,
      nameEn,
      addressUk,
      dailyRate: parseInt(dailyRate),
      warehouseTypeId: type as string,
    });
  };

  return (
    <main className="flex min-h-[var(--h-antinav)] flex-col bg-gray-50 p-12">
      <h2 className="mb-4 text-3xl font-extrabold text-gray-700">
        New Warehouse
      </h2>
      <div className="flex w-fit flex-col gap-2">
        <AuthInput
          id="name-en"
          placeholder="Name in Ukrainian"
          value={nameUk}
          onChange={(e) => setNameUk(e.target.value)}
        />
        <AuthInput
          id="name-uk"
          placeholder="Name in English"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
        />
        <AuthInput
          id="address-uk"
          placeholder="Address in Ukrainian"
          value={addressUk}
          onChange={(e) => setAddressUk(e.target.value)}
        />
        <AuthInput
          id="daily-rate"
          placeholder="Daily Rate"
          value={dailyRate}
          type="number"
          onChange={(e) => setDailyRate(e.target.value)}
        />

        <WarehouseTypesFilter
          pathname="/rent-your-warehouse/new"
          title="title-warehouse"
          displayIcon={false}
        />

        <button
          type="button"
          disabled={!nameUk || !addressUk || !dailyRate || !type}
          onClick={() => void handleSubmit()}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm
            hover:bg-primary-600
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
        {success && (
          <p className="text-green-500">Warehouse has been created</p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </main>
  );
};

export default NewWarehouse;
