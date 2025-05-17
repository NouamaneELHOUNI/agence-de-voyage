"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import useUserStore from "@/store/userStore"
import useAuthStore from "@/store/authStore"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  bio: z.string().max(500, {
    message: "Bio must not be longer than 500 characters.",
  }),
})

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { profile, fetchUserProfile, updateProfile, uploadProfileImage, removeProfileImage } = useUserStore()
  const { user } = useAuthStore()

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      bio: "",
    },
  })

  // Fetch profile data when component mounts
  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user, fetchUserProfile])

  // Update form values when profile data changes
  useEffect(() => {
    if (profile) {
      form.reset(profile)
    } else {
      // Reset form to empty values if no profile exists
      form.reset({
        name: "",
        email: user?.email || "", // Only pre-fill email from auth if available
        phone: "",
        position: "",
        bio: "",
      })
    }
  }, [profile, form, user?.email])

  async function onSubmit(data) {
    setIsLoading(true)
    try {
      console.log("Submitting form data:", data);
      const result = await updateProfile(data)
      console.log("Update result:", result);
      if (result.success) {
        console.log("Profile updated successfully")
      } else {
        console.error("Failed to update profile:", result.error)
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      const result = await uploadProfileImage(file)
      if (result.success) {
        console.log("Profile image uploaded successfully")
      } else {
        console.error("Failed to upload image:", result.error)
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveImage = async () => {
    setIsLoading(true)
    try {
      const result = await removeProfileImage()
      if (result.success) {
        console.log("Profile image removed successfully")
      } else {
        console.error("Failed to remove image:", result.error)
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile?.profileImage || "/placeholder.svg?height=96&width=96"} alt="Profile picture" />
          <AvatarFallback>{profile?.name?.split(' ').map(n => n[0]).join('') || 'AK'}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Profile Picture</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <label>
                Upload New
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isLoading}
                />
              </label>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              disabled={isLoading || !profile?.profileImage}
            >
              Remove
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 3MB.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
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
                    <Input placeholder="Your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="Your position" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us a little about yourself" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>Brief description for your profile. URLs are hyperlinked.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  )
}