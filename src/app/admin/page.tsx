import { clerkClient } from "@clerk/nextjs/server";
import { removeRole, setRole, deleteUser } from "./actions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Admin() {
  const client = await clerkClient();
  const users = (await client.users.getUserList()).data;

  return (
    <div className="w-full min-h-screen overflow-x-hidden p-4">
      {/* Users Table */}
      <h2 className="text-2xl font-bold mb-4 dark:text-neutral-200">Users</h2>
      <Table>
        <TableCaption>List of all registered users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>
                {
                  user.emailAddresses.find(
                    (email) => email.id === user.primaryEmailAddressId
                  )?.emailAddress
                }
              </TableCell>
              <TableCell>{user.publicMetadata.role as string}</TableCell>
              <TableCell className="text-right flex gap-2 justify-end">
                <form action={setRole} className="inline">
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="admin" name="role" />
                  <button
                    type="submit"
                    className="px-2 py-1 text-sm border border-neutral-300 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    Make Admin
                  </button>
                </form>
                <form action={setRole} className="inline">
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="creator" name="role" />
                  <button
                    type="submit"
                    className="px-2 py-1 text-sm border border-neutral-300 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    Make Creator
                  </button>
                </form>
                <form action={setRole} className="inline">
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="write-access" name="role" />
                  <button
                    type="submit"
                    className="px-2 py-1 text-sm border border-neutral-300 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    Give Write Access
                  </button>
                </form>
                <form action={removeRole} className="inline">
                  <input type="hidden" value={user.id} name="id" />
                  <button
                    type="submit"
                    className="px-2 py-1 text-sm border border-neutral-300 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    Remove Role
                  </button>
                </form>
                <form action={deleteUser} className="inline">
                  <input type="hidden" value={user.id} name="id" />
                  <button
                    type="submit"
                    className="px-2 py-1 text-sm border border-red-500 text-red-600 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900"
                  >
                    Delete User
                  </button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
