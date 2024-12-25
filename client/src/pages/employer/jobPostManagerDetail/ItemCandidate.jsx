import IconEye from "@/components/icons/IconEye";
import imgAvatar from "@/components/image/avatarImg.png";
import React from "react";
import { Checkbox } from "@/components/ui/Checkbox";

import IconClose from "@/components/icons/IconClose";
import IconAccept from "@/components/icons/IconAccept";
import Buttonchild from "@/components/button/Buttonchild";
import IconMail from "@/components/icons/IconMail";

const ItemCandidate = ({
  index,
  name,
  aiScore,
  githubScore,
  description,
  date,
  avatarUrl,
  candidatesLimit,
  onClick,
  handleSelectCandidate,
  publicEmail,
  userId,
  StatusNotification,
  StatusSendGmail,
  handleDeleteCandidate,
  checked,
}) => {
  return (
    <div className="relative flex flex-col gap-5 text-sm bg-white rounded-lg border hover:border-primary">
      {/* Candidate Info Card */}
      <div className="absolute">
        <div
          className={`relative w-10 h-10 border-l-[20px] border-t-[20px] ${
            candidatesLimit
              ? "border-l-primary border-t-primary"
              : "border-l-text3 border-t-text3"
          } border-r-[20px] border-r-transparent border-b-[20px] border-b-transparent rounded-tl-lg`}
        >
          <div className="absolute w-7 h-5 z-10 text-center text-white top-[-19px] left-[-22px] rounded-sm">
            {index + 1}
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-3 pl-9 pr-3 py-3">
        <div className="flex items-center justify-center rounded-md border">
          <img
            src={avatarUrl ? avatarUrl : imgAvatar}
            alt=""
            className="min-w-[80px] max-w-[80px] min-h-[80px] max-h-[80px] rounded-md object-cover"
          />
        </div>
        <div className="flex flex-col justify-around gap-1 w-full">
          <div className="flex gap-10 items-center justify-between">
            <div className="flex gap-10 items-center">
              <div className="cursor-pointer line-clamp-1 text-ellipsis font-medium w-44">
                {name}
              </div>
              <IconMail
                className={"w-6 h-6"}
                color={`${StatusSendGmail ? "#22C55E" : "#B2B3BD"}`}
              ></IconMail>
              {StatusNotification === "ACCEPTED" ? (
                <IconAccept className="w-6 h-6" color="#22C55E" />
              ) : StatusNotification === "REJECTED" ? (
                <IconClose className="w-6 h-6" color="#EB5757" />
              ) : (
                ""
              )}
            </div>
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-300 rounded-full"></div>
                <span>{aiScore}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>{githubScore}</span>
              </div>
              <Checkbox
                id="candidate-select"
                className="w-5 h-5 mr-5"
                checked={checked}
                onClick={() => handleSelectCandidate(publicEmail, userId)}
              />
            </div>
          </div>
          <span className="w-fit line-clamp-1 text-xs text-text3 max-w-[400px]">
            {description}
          </span>
          <div className="flex items-center justify-between">
            <span className="px-5 text-text2 bg-[#EDEAF0] rounded-xl py-[2px]">
              Ngày nộp đơn: {date}
            </span>
            <div className="flex items-center gap-2">
              {/* <Buttonchild
                  kind="ghost"
                  className="flex items-center gap-2 text-sm px-3 py-1"
                  onClick={() => handleDeleteCandidate(userId)}
                >
                  <IconDelete className="w-5 h-5" color="#fff" />
                  Xóa
                </Buttonchild> */}
              <Buttonchild
                kind="primary"
                className="flex items-center text-sm gap-2 px-3 py-1"
                onClick={onClick}
              >
                <IconEye className="w-5 h-5" color="#fff" />
                Xem chi tiết
              </Buttonchild>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCandidate;
