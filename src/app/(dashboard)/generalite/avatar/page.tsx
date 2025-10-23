import { AddAvatarsForm } from "./_components/AddAvatarsForm";
import { AvatarsList } from "./_components/AvatarsList";

export default function AvatarPage() {
  return (
    <div className="py-4 space-y-4 px-14">
      <h1 className="text-2xl font-semibold">Avatar</h1>
      <AddAvatarsForm />
      <div className="space-y-2">
        <h2 className="text-xl font-medium">Liste des avatars</h2>
        <AvatarsList />
      </div>
    </div>
  );
}
