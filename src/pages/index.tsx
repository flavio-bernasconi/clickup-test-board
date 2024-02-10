import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useSession, getSession, signIn, signOut } from "next-auth/react";

// import Board from "@/components/Board";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const Board = dynamic(import("@/components/Board"));

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const queryView = new URLSearchParams({ page: "0" }).toString();

    const viewId = "6-901502626063-1";
    const resp = await fetch(
      `https://api.clickup.com/api/v2/view/${viewId}/task?${queryView}`,
      {
        method: "GET",
        headers: {
          Authorization: "pk_62590589_RSESNQ4AWLBP1F87DQWDHAC5Q3DDQTEO",
        },
      }
    );

    const listId = "901502626063";
    const listFetched = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}`,
      {
        method: "GET",
        headers: {
          Authorization: "pk_62590589_RSESNQ4AWLBP1F87DQWDHAC5Q3DDQTEO",
        },
      }
    );

    const list = await listFetched.json();

    const data = await resp.json();
    return { props: { data, statuses: list.statuses } };
  } catch (error) {
    console.error(error);
    return { props: { data: error } };
  }
}

export default function Home({
  data,
  statuses,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [winReady, setwinReady] = useState(false);
  useEffect(() => {
    setwinReady(true);
  }, []);
  // const { data: session, status } = useSession();
  // const userName = session?.user?.name;

  // if (status === "loading") {
  //   return <p>Hang on there...</p>;
  // }

  // if (status === "authenticated") {
  return (
    <div className="p-12">
      {/* <p>Signed in as {userName}</p> */}
      <button onClick={() => signOut()}>Sign out</button>
      <div className="mt-20" />
      {data.tasks.map((us: any) => {
        const group = statuses.reduce((acc: any, { status, id }: any) => {
          acc[us.id + id] = {
            title: status,
            items: us.subtasks.filter(
              (task: any) => task.status.status === status
            ),
          };
          return acc;
        }, {});

        return (
          <div key={us.id} className="mt-12">
            <h1>{us.name}</h1>
            {winReady && group && <Board data={group} />}
          </div>
        );
      })}
    </div>
  );
  // }

  return (
    <>
      <p>Not signed in.</p>
      <button className="bk-primary" onClick={() => signIn("click-up")}>
        Sign in
      </button>
    </>
  );
}
