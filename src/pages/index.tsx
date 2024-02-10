import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useSession, getSession, signIn, signOut } from "next-auth/react";
import styled from "styled-components";

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

const Grid = styled.div`
  display: flex;
  gap: 50px;
`;

const Column = styled.div`
  height: 50vh;
  border: solid 2px #d0d0d0;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px;
`;

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
      {/* <button onClick={() => signOut()}>Sign out</button> */}
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
          <Grid key={us.id} className="mt-12">
            <Column>
              <h1>{us.name}</h1>
            </Column>
            {winReady && group && <Board data={group} />}
          </Grid>
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
