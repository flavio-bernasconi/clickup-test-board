import React, { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import styled from "styled-components";

const Grid = styled.div`
  display: flex;
  gap: 50px;
`;

const Column = styled.div`
  min-height: 50vh;
  border: solid 2px #d0d0d0;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px;
`;

const Kanban = ({ data }) => {
  const [columns, setColumns] = useState(data);
  // const { data: session, status } = useSession();

  const updateTask = async ({ status, id }) => {
    try {
      return await fetch(`api/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "pk_62590589_RSESNQ4AWLBP1F87DQWDHAC5Q3DDQTEO",
        },
        body: JSON.stringify({
          status,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onDragEnd = async (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    try {
      if (source.droppableId !== destination.droppableId) {
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems,
          },
        });
        await updateTask({
          id: removed.id,
          status: destColumn.title,
        });
        // if (!data.ok) {
        // roll back
        // }
      }
    } catch (error) {
      console.error(error);
    }

    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  if (!data) return null;

  return (
    <DragDropContext
      onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
    >
      <div>
        <Grid>
          {Object.entries(columns).map(([columnId, column]) => {
            return (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided, snapshot) => (
                  <Column ref={provided.innerRef} {...provided.droppableProps}>
                    <span>{column.title}</span>
                    {column.items.map((item, index) => (
                      <TaskCard key={item.id} item={item} index={index} />
                    ))}
                    {provided.placeholder}
                  </Column>
                )}
              </Droppable>
            );
          })}
        </Grid>
      </div>
    </DragDropContext>
  );
};

export default Kanban;
