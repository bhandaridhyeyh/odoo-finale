import { useContext } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!user ? (
                <p className="text-muted-foreground">You are not logged in.</p>
              ) : (
                <>
                  <div><span className="text-sm text-muted-foreground">Name: </span>{[user.firstName, user.lastName].filter(Boolean).join(" ") || "-"}</div>
                  <div><span className="text-sm text-muted-foreground">Email: </span>{user.email}</div>
                  <div><span className="text-sm text-muted-foreground">Phone: </span>{user.phone || "-"}</div>
                  <div><span className="text-sm text-muted-foreground">City: </span>{user.city || "-"}</div>
                  <div><span className="text-sm text-muted-foreground">Country: </span>{user.country || "-"}</div>
                  <div><span className="text-sm text-muted-foreground">Verified: </span>{user.isVerified ? "Yes" : "No"}</div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;