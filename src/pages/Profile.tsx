
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserProfile, updateUserProfile } from "@/services/userService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";

type ProfileFormValues = {
  fullName: string;
  email: string;
  avatarUrl?: string;
};

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => fetchUserProfile(user?.id!),
    enabled: !!user?.id,
  });

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: profile?.full_name || user?.user_metadata?.full_name || '',
      email: user?.email || '',
      avatarUrl: profile?.avatar_url || '',
    },
  });

  // Update form values when profile data is loaded
  useState(() => {
    if (profile) {
      form.reset({
        fullName: profile.full_name || user?.user_metadata?.full_name || '',
        email: user?.email || '',
        avatarUrl: profile.avatar_url || '',
      });
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: (values: ProfileFormValues) => {
      return updateUserProfile(user?.id!, { 
        full_name: values.fullName,
        avatar_url: values.avatarUrl 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 pt-24">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-24">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">My Profile</CardTitle>
          <CardDescription>
            Manage your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-brand-blue text-white text-xl">
                {user?.user_metadata?.full_name
                  ? user.user_metadata.full_name.split(' ').map(name => name[0]).join('')
                  : <User />}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="text-xl font-medium">
                {profile?.full_name || user?.user_metadata?.full_name || 'User'}
              </h2>
              <p className="text-gray-500">{user?.email}</p>
              {profile?.role && (
                <span className="inline-block bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm mt-1">
                  {profile.role}
                </span>
              )}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={true} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end pt-4 space-x-2">
                {!isEditing ? (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" type="button" onClick={() => {
                      setIsEditing(false);
                      form.reset({
                        fullName: profile?.full_name || user?.user_metadata?.full_name || '',
                        email: user?.email || '',
                        avatarUrl: profile?.avatar_url || '',
                      });
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
