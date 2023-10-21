"use client";

import {FormEvent} from "react";

export default function LocationForm() {
  function onFormSubmitted(e: FormEvent) {
    e.preventDefault();
    const value = e.target.value;

    console.log(value);
  }

  return (
    <form onSubmit={onFormSubmitted}>
      <label htmlFor="location">Tu ciudad</label>
      <input name="location" type="text" />
    </form>
  );
}
