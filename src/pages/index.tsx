import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useSession, getSession, signIn, signOut } from "next-auth/react";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const session = await getSession(ctx);
    if (!session && (session as any)?.accessToken)
      return { props: { data: "no session" } };

    const query = new URLSearchParams({ archived: "false" }).toString();
    const spaceId = "90151432148";
    const resp = await fetch(
      `https://api.clickup.com/api/v2/space/${spaceId}/folder?${query}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${(session as any)?.accessToken}`,
        },
      }
    );

    const data = await resp.json();
    return { props: { data } };
  } catch (error) {
    console.log(error);
    return { props: { data: error } };
  }
}

export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status } = useSession();
  console.log({ data });
  console.log({ session });
  const userName = session?.user?.name;

  if (status === "loading") {
    return <p>Hang on there...</p>;
  }

  if (status === "authenticated") {
    return (
      <>
        <p>Signed in as {userName}</p>
        <button onClick={() => signOut()}>Sign out</button>
        <h1>{JSON.stringify(data, undefined, 2)}</h1>
      </>
    );
  }

  return (
    <>
      <p>Not signed in.</p>
      <button className="bk-primary" onClick={() => signIn("click-up")}>
        Sign in
      </button>
    </>
  );
}
