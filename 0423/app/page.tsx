import { redirect } from 'next/navigation';
import { getCurrentAuthUser } from '@/lib/auth';

export default async function RootPage() {
  const user = await getCurrentAuthUser();
  redirect(user ? '/dashboard' : '/login');
}
yerin good~<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
</head>
<body>
  
</body>
</html>