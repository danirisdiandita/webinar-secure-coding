"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/string_util";
import { useProfileStore } from "@/store/profile-store";
import { useProfile } from "@/hooks/useProfile";

export default function ProfileSettings() {
  const { updateProfile } = useProfile();
  const pStore = useProfileStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [username, setUsername] = useState("");
  const handleSaveChanges = () => {
    const formData = new FormData();
    if (firstName) {
      formData.append("first_name", firstName);
    }
    if (lastName) {
      formData.append("last_name", lastName);
    }
    if (profilePictureFile) {
      formData.append("profile_image", profilePictureFile as File);
    }
    if (username) {
      formData.append("username", username);
    }

    updateProfile(formData);
  };

  useEffect(() => {
    setFirstName(pStore?.firstName);
    setLastName(pStore?.lastName);
    if (pStore?.profilePicture) {
      setProfilePicture(pStore?.profilePicture as string);
    }
    setUsername(pStore?.username);
  }, [
    pStore.firstName,
    pStore.lastName,
    pStore.profilePicture,
    pStore.username,
  ]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file instanceof File) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
      setProfilePictureFile(file);
    }
  };

  const handleDeletePicture = () => {
    setProfilePicture(null);
    setProfilePictureFile(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Profile picture</Label>
          <div className="flex items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profilePicture ? profilePicture : ''} />
              <AvatarFallback>
                {getInitials("Norma Dani Risdiandita")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-row md:flex-col gap-2">
              <div className="md:flex md:gap-2 flex-col md:flex-row space-y-2 md:space-y-0">
                <Button
                  variant="secondary"
                  className="relative w-full md:w-auto"
                >
                  Change picture
                  <input
                    type="file"
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeletePicture}
                  disabled={!profilePicture}
                  className="relative w-full md:w-auto"
                >
                  Delete picture
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input id="username" value={username} disabled />
            </div>
            <p className="text-sm text-muted-foreground">
              Username cannot be changed
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveChanges}>Save changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
