import React, { useEffect, useState } from "react";
import "../../css/ForgetPassword.css";
import { Field, useForm } from "@tanstack/react-form";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../store/User/user-action";
import { userActions } from "../../store/User/user-slice";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const { errors } = useSelector((state) => state.user);
  const [sending, setSending] = useState(false);

  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      setSending(true);
      try {
        await dispatch(forgotPassword(value.email));
        toast.success("Reset email sent. Check your Mailtrap Sandbox inbox.");
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not send reset email");
      } finally {
        setSending(false);
      }
    },
  });

  useEffect(() => {
    if (errors) {
      toast.error(errors);
      dispatch(userActions.clearErrors());
    }
  }, [errors, dispatch]);

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <h1 className="password_title">Forget Password</h1>
          <form.Field name="email">
            {(field) => (
              <div className="form-group">
                <label htmlFor="email_field">Enter Email</label>
                <input
                  type="email"
                  id="email_field"
                  className="form-control"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
              </div>
            )}
          </form.Field>
          <button
            id="forgot_password_button"
            type="submit"
            className="btn-block py-3 password-btn"
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
