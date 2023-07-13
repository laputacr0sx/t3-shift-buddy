import React from "react";
import RegisterDayOffForm from "~/components/RegisterDayOffForm";

function index() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>假期申請表</h1>
      <div className="flex w-1/2 items-center justify-center">
        <RegisterDayOffForm />
      </div>
    </div>
  );
}

export default index;
