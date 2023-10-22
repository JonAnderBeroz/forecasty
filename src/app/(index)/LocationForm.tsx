"use client";

export default function Test({search}: {search: (location: string) => void}) {
  function hanldeAction(data: FormData) {
    const location: string = data.get("location") as string;

    if (!location) return;
    search(location);
  }

  return (
    <form action={hanldeAction} className="flex gap-3 items-center">
      <input className="px-2 rounded-xl h-8" name="location" placeholder="London" type="text" />
    </form>
  );
}
