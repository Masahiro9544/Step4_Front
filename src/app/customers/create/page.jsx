"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import createCustomer from "./createCustomer";

export default function CreatePage() {
  const formRef = useRef();
  const router = useRouter();

  // エラーメッセージ用のstate
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);

    // フロント側で空チェック
    const customer_name = formData.get("customer_name");

    const newErrors = {};
    if (!customer_name) newErrors.customer_name = "Customer name が必要です";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // ここで処理中断して画面にエラー表示
    }

    try {
      // createCustomer関数からcustomer_idを受け取る
      const customer_id = await createCustomer(formData);
      router.push(`./create/confirm?customer_id=${customer_id}`);
    } catch (error) {
      // APIからのエラーもここでキャッチしstateに反映可
      setErrors({ api: error.message || "顧客作成に失敗しました" });
    }
  };

  return (
    <>
      <div className="card bordered bg-white border-blue-200 border-2 max-w-md m-4">
        <div className="m-4 card bordered bg-blue-200 duration-200 hover:border-r-red">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="card-body">
              <h2 className="card-title">お名前</h2>
              <input
                type="text"
                name="customer_name"
                placeholder="桃太郎"
                className="input input-bordered"
              />
              {errors.customer_name && (
                <p style={{ color: "red", fontSize: "0.8em" }}>
                  {errors.customer_name}
                </p>
              )}

              {/* エラー③: customer_idは自動生成される形に変更 */}
              {/* <p>
                Customer ID:
                <input
                  type="text"
                  name="customer_id"
                  placeholder="C030"
                  className="input input-bordered"
                />
              </p> */}

              <p>
                Age:
              </p>
              <input
                type="number"
                name="age"
                placeholder="30"
                className="input input-bordered"
              />

              <p>
                Gender:
              </p>
              <input
                type="text"
                name="gender"
                placeholder="女"
                className="input input-bordered"
              />

              {/* APIエラー */}
              {errors.api && (
                <p style={{ color: "red", fontSize: "0.9em", marginTop: "1em" }}>
                  {errors.api}
                </p>
              )}

            </div>

            <div className="flex justify-center">
              <button type="submit" className="btn btn-primary m-4 text-2xl">
                作成
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
