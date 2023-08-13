import { useState } from "react";
import { api } from "@/utils/api";
import { AuthInput } from "@/components/auth/Input";

export default function WarehouseTypes() {
  const warehouseTypes = api.public.warehouseTypes.useQuery();
  const createWarehouseType = api.admin.createWarehouseType.useMutation({
    onSuccess: async () => {
      await warehouseTypes.refetch();
      setNameUk("");
      setNameEn("");
    },
  });

  const [nameUk, setNameUk] = useState("");
  const [nameEn, setNameEn] = useState("");

  return (
    <main className="mx-auto max-w-3xl flex-1 p-8">
      <h1 className="mb-4 text-3xl font-bold">Warehouse Types</h1>
      <p className="mb-8 text-gray-500">
        Update, Delete warehouse types, or create new one
      </p>

      <div className="flex flex-col justify-between gap-5 rounded p-4 shadow-lg transition">
        {warehouseTypes.data?.map((warehouseType) => (
          <div key={warehouseType.id} className="flex justify-between">
            <div className="flex gap-2">
              <h3 className="mb-2 text-xl font-medium">
                {warehouseType.nameUk}
              </h3>
              {warehouseType.nameEn && (
                <>
                  <span>/</span>
                  <h3 className="mb-2 text-xl font-medium">
                    {warehouseType.nameEn}
                  </h3>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                Update
              </button>
              <button className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-between">
          <div className="flex gap-2">
            <AuthInput
              placeholder="Name Uk"
              value={nameUk}
              onChange={(e) => setNameUk(e.target.value)}
            />
            <AuthInput
              placeholder="Name En"
              onChange={(e) => setNameEn(e.target.value)}
            />
          </div>
          <button
            className="rounded bg-green-500 px-4 py-2 font-bold text-white shadow-md hover:bg-green-700"
            onClick={() => createWarehouseType.mutate({ nameUk, nameEn })}
          >
            Create
          </button>
        </div>
      </div>
    </main>
  );
}
