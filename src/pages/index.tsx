import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useSession, getSession, signIn, signOut } from "next-auth/react";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const session = await getSession(ctx);
    if (!session && (session as any)?.accessToken)
      return { props: { data: "no session" } };

    const queryView = new URLSearchParams({ page: "0" }).toString();

    const viewId = "6-901502626063-1";
    const resp = await fetch(
      `https://api.clickup.com/api/v2/view/${viewId}/task?${queryView}`,
      {
        method: "GET",
        headers: {
          Authorization: (session as any)?.accessToken,
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
  const userName = session?.user?.name;

  console.log({ data });

  if (status === "loading") {
    return <p>Hang on there...</p>;
  }

  if (status === "authenticated") {
    return (
      <>
        <p>Signed in as {userName}</p>
        <button onClick={() => signOut()}>Sign out</button>
        <div className="mt-20" />
        {data.tasks.map((us: any) => {
          return (
            <div key={us.id} className="mt-5">
              <h1>{us.name}</h1>
              {us.subtasks.map((task: any) => {
                return (
                  <div className="ml-5" key={task.id}>
                    <h3>{task.name}</h3>
                  </div>
                );
              })}
            </div>
          );
        })}
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
