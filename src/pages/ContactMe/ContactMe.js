import React, { useState, useEffect } from 'react';
import './ContactMe.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Snackbar from "@mui/material/Snackbar";

const ContactMe = () => {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setTimeout(() => {
      setOpen(true);
    }, 5000);

    handleClose();
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [ip, setIP] = useState("");

  const getData = async () => {
    const res = await axios.get("https://api.ipify.org/?format=json");
    setIP(res.data.ip);
  };

  useEffect(() => {
    getData();
  }, []);

  const [uuid, setUUID] = useState("");

  useEffect(() => {
    const updatedItems = crypto.randomUUID();
    setUUID(updatedItems);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailData = {
      sender: { name: formData.name, email: formData.email },
      to: [{ email: "meri.ad900@gmail.com", name: "Mehrad" }],
      replyTo: { email: formData.email, name: formData.name },
      subject: `New message from ${formData.name} at your website`,
      htmlContent: `<html><body><h1>You have a new message from your website</h1><p><strong>Name:</strong> ${formData.name}</p><p><strong>Email:</strong> ${formData.email}</p><p><strong>Message:</strong> ${formData.message}</p></body></html>`,
      headers: {
        "sender.ip": ip,
        "X-Mailin-custom": "some_custom_header",
        idempotencyKey: uuid,
      },
      params: {
        FNAME: formData.name.split(" ")[0],
        LNAME: formData.name.split(" ")[1] || "",
      },
      batchId: "5c6cfa04-eed9-42c2-8b5c-6d470d978e9d",
    };

    try {
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        emailData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "api-key": process.env.REACT_APP_MY_API,
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div name="contactMe" className="contact">
      <h1>Contact Me</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleInputChange}
        />
        <div className="button-container">
          <button onClick={handleClick} type="submit">
            {"Submit".split("").map((letter, i) => (
              <span className="letter" key={i}>
                {letter}
              </span>
            ))}
          </button>
        </div>
      </form>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        variant="success"
        message="Your message has been sent!"
      />
    </div>
  );
};

export default ContactMe;
