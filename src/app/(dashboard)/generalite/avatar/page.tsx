import { AddAvatarsForm } from "./_components/AddAvatarsForm";
import { AvatarsList } from "./_components/AvatarsList";

export default function AvatarPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Avatar</h1>
      <AddAvatarsForm />
      <div className="space-y-2">
        <h2 className="text-xl font-medium">Liste des avatars</h2>
        <AvatarsList />
      </div>
    </div>
  );
}
