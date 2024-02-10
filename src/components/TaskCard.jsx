import React from "react";
import { Draggable } from "react-beautiful-dnd";

const TaskCard = ({ item, index }) => {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div style={{ background: "#e0e0e0", padding: 20 }}>
              <p>{item.name}</p>
              <p>{item.status.status}</p>
              <p>{item.id}</p>
              {/* <div className="secondary-details">
              <p>
                <span>
                  {new Date(item.Due_Date).toLocaleDateString("en-us", {
                    month: "short",
                    day: "2-digit",
                  })}
                </span>
              </p>
            </div> */}
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};

export default TaskCard;
