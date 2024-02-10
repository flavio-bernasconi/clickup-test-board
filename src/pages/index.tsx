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

    if (ctx.query.listId) {
      const viewId = ctx.query.listId;
      const resp = await fetch(
        `https://api.clickup.com/api/v2/view/${viewId}/task?${queryView}`,
        {
          method: "GET",
          headers: {
            Authorization: "pk_62590589_RSESNQ4AWLBP1F87DQWDHAC5Q3DDQTEO",
          },
        }
      );

      const data = await resp.json();

      const resView = await fetch(
        `https://api.clickup.com/api/v2/view/${viewId}`,
        {
          method: "GET",
          headers: {
            Authorization: "pk_62590589_RSESNQ4AWLBP1F87DQWDHAC5Q3DDQTEO",
          },
        }
      );

      const viewInfo = await resView.json();

      const listId = viewInfo.view.parent.id;
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

      return { props: { data, statuses: list.statuses } };
    } else {
      return { props: { data: [], statuses: [] } };
    }
  } catch (error) {
    console.error(error);
    return { props: { data: error } };
  }
}

const Grid = styled.div`
  display: flex;
  gap: 50px;
`;

const Us = styled.div`
  min-height: 20vh;
  background-color: #747474;
  min-width: 300px;
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
  const [urlLocation, setUrl] = useState("");
  useEffect(() => {
    const url =
      window.location != window.parent.location
        ? document.referrer
        : document.location.href;

    setUrl(url);
    setwinReady(true);
  }, []);
  // const { data: session, status } = useSession();
  // const userName = session?.user?.name;

  // if (status === "loading") {
  //   return <p>Hang on there...</p>;
  // }

  if (!data || data?.tasks?.length === 0 || statuses.length === 0)
    return <p>no data found something is wrong</p>;

  // if (status === "authenticated") {
  return (
    <div className="p-12">
      <h2>URL:{urlLocation}</h2>
      {/* <p>Signed in as {userName}</p> */}
      {/* <button onClick={() => signOut()}>Sign out</button> */}
      <div className="mt-20" />
      {data?.tasks?.map((us: any) => {
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
            <Us>
              <h1>{us.name}</h1>
            </Us>
            {winReady && group && <Board data={group} />}
          </Grid>
        );
      })}
    </div>
  );
  // }
}
