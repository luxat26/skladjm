import { getItems } from "@/actions/items"; // Změna importu!
import ItemList from "@/components/features/ItemList";
import GeneralInfo from "@/components/features/GeneralInfo"; 
import { getGeneralInfo } from "@/actions/info"; 
import { Package } from "lucide-react"; // Zmizel LogOut

export default async function Dashboard() {
  // Načteme položky a text nástěnky rovnou z našich čistých akcí
  const items = await getItems();
  const infoText = await getGeneralInfo();

  return (
    <main className="min-h-screen bg-[#F1F5F9] pb-20 px-4 font-sans">
      <header className="max-w-md mx-auto py-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <Package className="w-8 h-8 text-blue-600" /> DOMA
          </h1>
          <p className="text-slate-500 font-bold text-xs mt-1 uppercase tracking-wider pl-1">
            Evidence věcí
          </p>
        </div>

        {/* Tlačítka vpravo nahoře - zbyla jen Nástěnka */}
        <div className="flex gap-2">
            <GeneralInfo initialText={infoText} />
        </div>
      </header>

      <div className="max-w-md mx-auto space-y-6">
        {/* Už nepředáváme currentUser */}
        <ItemList initialItems={items} />
      </div>
    </main>
  );
}