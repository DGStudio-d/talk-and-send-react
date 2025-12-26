
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

// Dummy data for users
const users = [
  { id: 1, name: "محمد أحمد", email: "mohamed@example.com", phone: "050-1234567", registrationDate: "2023-05-12" },
  { id: 2, name: "فاطمة علي", email: "fatima@example.com", phone: "055-7654321", registrationDate: "2023-06-20" },
  { id: 3, name: "عبدالله محمد", email: "abdullah@example.com", phone: "054-9876543", registrationDate: "2023-07-15" },
  { id: 4, name: "نورة سالم", email: "noura@example.com", phone: "056-3216549", registrationDate: "2023-08-02" },
  { id: 5, name: "خالد عمر", email: "khaled@example.com", phone: "058-7412589", registrationDate: "2023-09-10" },
];

interface UserFormValues {
  name: string;
  email: string;
  phone: string;
}

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find the user based on ID
  const userId = Number(id);
  const user = users.find(user => user.id === userId);
  
  const form = useForm<UserFormValues>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || ""
    }
  });
  
  const onSubmit = (data: UserFormValues) => {
    console.log("Updated user data:", data);
    
    // Here you would call your API to update the user
    
    toast({
      title: "تم التحديث بنجاح",
      description: "تم تحديث بيانات المستخدم بنجاح",
    });
    refetch();
    
    // Navigate back to users page after successful update
    setTimeout(() => {
      navigate("/admin/users");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="outline" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate("/admin/users")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">تعديل المستخدم</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>بيانات المستخدم</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم</FormLabel>
                    <FormControl>
                      <Input placeholder="اسم المستخدم" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="example@example.com" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="05X-XXXXXXX" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/admin/users")}
                  className="ml-2"
                >
                  إلغاء
                </Button>
                <Button type="submit">حفظ التغييرات</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditUserPage;
