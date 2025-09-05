import { clerkClient } from "@clerk/nextjs/server"
import { removeRole, setRole, deleteUser } from "./actions"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Shield, Trash2 } from "lucide-react"

export default async function Admin() {
  const client = await clerkClient()
  const users = (await client.users.getUserList()).data

  const totalUsers = users.length
  const adminUsers = users.filter((user) => user.publicMetadata.role === "admin").length
  const creatorUsers = users.filter((user) => user.publicMetadata.role === "creator").length
  const writeAccessUsers = users.filter((user) => user.publicMetadata.role === "write-access").length

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Manage users and permissions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-lg sm:text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Administrators</CardTitle>
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-lg sm:text-2xl font-bold">{adminUsers}</div>
              <p className="text-xs text-muted-foreground">Admin users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Creators</CardTitle>
              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-lg sm:text-2xl font-bold">{creatorUsers}</div>
              <p className="text-xs text-muted-foreground">Creator users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Write Access</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-lg sm:text-2xl font-bold">{writeAccessUsers}</div>
              <p className="text-xs text-muted-foreground">Write access users</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              User Management
            </CardTitle>
            <CardDescription className="text-sm">
              Manage user roles and permissions for your application
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="block sm:hidden">
              <div className="space-y-4 p-4">
                {users.map((user) => (
                  <Card key={user.id} className="p-4">
                    <div className="space-y-3">
                      <div>
                        <div className="font-medium text-base">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground break-all">
                          {user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Role:</span>
                        {user.publicMetadata.role ? (
                          <Badge
                            variant={
                              user.publicMetadata.role === "admin"
                                ? "destructive"
                                : user.publicMetadata.role === "creator"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-sm"
                          >
                            {user.publicMetadata.role as string}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-sm">
                            No Role
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Set Role:</div>
                        <div className="grid grid-cols-2 gap-2">
                          <form action={setRole}>
                            <input type="hidden" value={user.id} name="id" />
                            <input type="hidden" value="admin" name="role" />
                            <Button type="submit" variant="outline" size="sm" className="w-full h-10 bg-transparent">
                              <Shield className="h-4 w-4 mr-2" />
                              Admin
                            </Button>
                          </form>
                          <form action={setRole}>
                            <input type="hidden" value={user.id} name="id" />
                            <input type="hidden" value="creator" name="role" />
                            <Button type="submit" variant="outline" size="sm" className="w-full h-10 bg-transparent">
                              <UserCheck className="h-4 w-4 mr-2" />
                              Creator
                            </Button>
                          </form>
                        </div>
                        <form action={setRole}>
                          <input type="hidden" value={user.id} name="id" />
                          <input type="hidden" value="write-access" name="role" />
                          <Button type="submit" variant="outline" size="sm" className="w-full h-10 bg-transparent">
                            Write Access
                          </Button>
                        </form>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <form action={removeRole}>
                            <input type="hidden" value={user.id} name="id" />
                            <Button type="submit" variant="secondary" size="sm" className="w-full h-10">
                              Remove Role
                            </Button>
                          </form>
                          <form action={deleteUser}>
                            <input type="hidden" value={user.id} name="id" />
                            <Button type="submit" variant="destructive" size="sm" className="w-full h-10">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableCaption className="px-6 pb-4">List of all registered users and their current roles.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] px-4">Name</TableHead>
                    <TableHead className="px-4">Email</TableHead>
                    <TableHead className="px-4">Role</TableHead>
                    <TableHead className="text-right px-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium px-4">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell className="text-muted-foreground px-4">
                        {user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress}
                      </TableCell>
                      <TableCell className="px-4">
                        {user.publicMetadata.role ? (
                          <Badge
                            variant={
                              user.publicMetadata.role === "admin"
                                ? "destructive"
                                : user.publicMetadata.role === "creator"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {user.publicMetadata.role as string}
                          </Badge>
                        ) : (
                          <Badge variant="outline">No Role</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right px-4">
                        <div className="flex gap-2 justify-end flex-wrap">
                          <form action={setRole} className="inline">
                            <input type="hidden" value={user.id} name="id" />
                            <input type="hidden" value="admin" name="role" />
                            <Button type="submit" variant="outline" size="sm">
                              <Shield className="h-4 w-4 mr-1" />
                              Admin
                            </Button>
                          </form>
                          <form action={setRole} className="inline">
                            <input type="hidden" value={user.id} name="id" />
                            <input type="hidden" value="creator" name="role" />
                            <Button type="submit" variant="outline" size="sm">
                              <UserCheck className="h-4 w-4 mr-1" />
                              Creator
                            </Button>
                          </form>
                          <form action={setRole} className="inline">
                            <input type="hidden" value={user.id} name="id" />
                            <input type="hidden" value="write-access" name="role" />
                            <Button type="submit" variant="outline" size="sm">
                              Write Access
                            </Button>
                          </form>
                          <form action={removeRole} className="inline">
                            <input type="hidden" value={user.id} name="id" />
                            <Button type="submit" variant="secondary" size="sm">
                              Remove Role
                            </Button>
                          </form>
                          <form action={deleteUser} className="inline">
                            <input type="hidden" value={user.id} name="id" />
                            <Button type="submit" variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
