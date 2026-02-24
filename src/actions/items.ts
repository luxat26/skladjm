'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Načtení všech položek
export async function getItems() {
  const supabase = await createClient();
  
  // Už nenačítáme "loans", protože tabulka neexistuje
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('name');

  if (error) {
    console.error("Chyba DB:", error);
    return [];
  }
  
  return data || [];
}

// Vytvoření položky
export async function createItem(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const box = formData.get("box") as string;
  const note = formData.get("note") as string;
  const quantity = parseInt(formData.get("quantity") as string) || 0;

  if (!name) return { error: "Název je povinný" };

  const { error } = await supabase
    .from('items')
    .insert([{ name, quantity, box, note, updated_at: new Date().toISOString() }]);

  if (error) return { error: error.message };
  revalidatePath('/');
  return { success: true };
}

// Smazání položky
export async function deleteItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('items').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/');
  return { success: true };
}

// Změna počtu kusů (+ / -)
export async function updateItemQuantity(itemId: string, delta: number) {
  const supabase = await createClient();
  
  const { data: item } = await supabase.from('items').select('quantity').eq('id', itemId).single();
  if (!item) return { error: "Nenalezeno" };

  const newQuantity = item.quantity + delta;
  
  const { error } = await supabase
    .from('items')
    .update({ 
        quantity: newQuantity < 0 ? 0 : newQuantity, // Nedovolíme jít do mínusu
        updated_at: new Date().toISOString() 
    })
    .eq('id', itemId);

  if (error) return { error: error.message };
  revalidatePath('/');
  return { success: true };
}

// Editace textů (Jméno, Box, Poznámka)
export async function updateItemDetails(itemId: string, name: string, box: string, note: string) {
  const supabase = await createClient();
  
  if (!name || name.trim().length === 0) {
      return { error: "Název nesmí být prázdný" };
  }

  const { error } = await supabase
    .from('items')
    .update({ 
        name, 
        box, 
        note,
        updated_at: new Date().toISOString() 
    })
    .eq('id', itemId);

  if (error) return { error: error.message };
  revalidatePath('/');
  return { success: true };
}