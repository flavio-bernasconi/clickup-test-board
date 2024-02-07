import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useSession, getSession, signIn, signOut } from "next-auth/react";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const session = await getSession(ctx);
    if (!session && (session as any)?.accessToken)
      return { props: { data: "no session" } };

    const query = new URLSearchParams({ archived: "false" }).toString();
    const spaceId = "9015347454";
    const resp = await fetch(
      `https://api.clickup.com/api/v2/folder/90151630703`,
      {
        method: "GET",
        headers: {
          Authorization: (session as any)?.accessToken,
        },
      }
    );
    const listFetch = await fetch(
      `https://api.clickup.com/api/v2/list/901502619596`,
      {
        method: "GET",
        headers: {
          Authorization: (session as any)?.accessToken,
        },
      }
    );

    const userFetch = await fetch(`https://api.clickup.com/api/v2/team`, {
      method: "GET",
      headers: {
        Authorization: (session as any)?.accessToken,
      },
    });

    const data = await resp.json();
    const user = await userFetch.json();
    const list = await listFetch.json();
    return { props: { data: [user, list, data] } };
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
        {(data as any)?.map((datum: string, i: number) => (
          <p key={i} className="mb-5">
            {JSON.stringify(datum)}
          </p>
        ))}
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
