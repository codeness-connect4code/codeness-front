import React, { useState } from "react";
import axios from "axios"; // Axios를 사용하여 API 호출
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MentoringPostForm = () => {
  const { handleSubmit, control, register } = useForm();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
      <div style={{ maxWidth: "600px", margin: "auto" }}>
        <h2>멘토 공고 올리기</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>제목</label>
            <input {...register("title", { required: true })} placeholder="멘토 공고입니다." />
          </div>

          <div>
            <label>회사명</label>
            <input {...register("company", { required: true })} placeholder="회사명을 입력해주세요." />
          </div>

          <div>
            <label>분야</label>
            <select {...register("field", { required: true })}>
              <option value="Back-End">Back-End</option>
              <option value="Front-End">Front-End</option>
            </select>
          </div>

          <div>
            <label>경력 (년)</label>
            <input type="number" {...register("experience", { required: true })} placeholder="5" />
          </div>

          <div>
            <label>지역</label>
            <input {...register("location", { required: true })} placeholder="예: 온라인/오프라인 서울권" />
          </div>

          <div>
            <label>시간당 멘토링 가격 (원)</label>
            <input type="number" {...register("price", { required: true })} placeholder="15000" />
          </div>

          <div>
            <label>시작 날짜</label>
            <Controller
                name="startDate"
                control={control}
                defaultValue={startDate}
                render={({ field }) => (
                    <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="yyyy-MM-dd"
                    />
                )}
            />
          </div>

          <div>
            <label>종료 날짜</label>
            <Controller
                name="endDate"
                control={control}
                defaultValue={endDate}
                render={({ field }) => (
                    <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="yyyy-MM-dd"
                    />
                )}
            />
          </div>

          <div>
            <label>시작 시간</label>
            <input type="time" {...register("startTime", { required: true })} />
          </div>

          <div>
            <label>종료 시간</label>
            <input type="time" {...register("endTime", { required: true })} />
          </div>

          <div>
            <label>설명글</label>
            <textarea {...register("description", { required: true })} placeholder="설명글을 입력해주세요." />
          </div>

          <button type="submit">작성하기</button>
        </form>
      </div>
  );
};

export default MentoringPostForm;
