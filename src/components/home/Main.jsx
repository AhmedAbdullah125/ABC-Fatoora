'use client'
import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import validator from "validator";
import { Button } from '@/components/ui/button';
import PhoneInput from 'react-phone-number-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';
import { motion } from 'framer-motion';
import { Textarea } from '../ui/textarea';
import { toast } from "sonner"
import Image from 'next/image';
import logo from '/public/ABC.webp'

export default function FormPage() {
    const [lang, setLang] = useState('en');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedLang = localStorage.getItem('lang');
            if (storedLang) {
                setLang(storedLang);
            }
        }
    }, []);
    const [data, setData] = useState(null);
    const formSchema = z.object({
        name: z.string().min(1, { message: "Name is required" }).max(50, { message: "Name must be at most 50 characters" }),
        company: z.string().min(1, { message: "Company name is required" }).max(100, { message: "Name must be at most 50 characters" }),
        phone: z.string().refine(validator.isMobilePhone, { message: "Invalid phone number" }),
        email: z.string().email({ message: "Invalid email address" }),
        // comments: z.string().max(500, { message: "Comments must be at most 500 characters" }),
        address: z.string().max(500, { message: "Address must be at most 500 characters" }).min(1, { message: "Address is required" }),
        total: z.string().min(1, { message: "Total is required" }),
        paid: z.string().min(1, { message: "Paid is required" })
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            // comments: '',
            company: '',
            address: '',
            total: '',
            paid: ''
        }
    });

    const Submit = (data) => {
        console.log(data);
        setData(data);
    };

    return (
        <div className="book-main-page">
            {data ? (
                <div className="container">
                    <div className="n-header">
                        <Image src={logo} alt="logo" width={100} height={100} className="logo" />
                        <h2>INVOICE</h2>
                    </div>

                    <div className="letter-details">
                        <div className="part">
                            <h3>From</h3>
                            <h4 className="sender-name">ABC Company</h4>
                            <span className="sender-address">Munchen, Germany</span>
                            <span className="sender-phone">+49 1520 4830172</span>
                            <span className="sender-mail">ahmedabdullahelsayed@gmail.com</span>
                            <span className="sender-taxid">TAX ID : 00XXXXX1234X0XX</span>
                        </div>
                        <div className="part">
                            <h3>Billed to</h3>
                            <h4 className="receiver-name">{data.name}</h4>
                            <span className="receiver-address">{data.address}</span>
                            <span className="receiver-company">{data.company}</span>
                            <span className="receiver-phone">{data.phone}</span>
                            <span className="receiver-email">{data.email}</span>
                        </div>
                        <div className="part">
                            <div className="semi-part">
                                <h3>Invoice No.</h3>
                                <span className="invoice-no">#656764-32</span>
                            </div>
                            <div className="semi-part">
                                <h3>Invoice Date</h3>
                                <span className="invoice-date">{new Date().toDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="due">
                        <span>Amount due</span>
                        <div className="due-amount">
                            <p>{Number(data.total).toFixed(2)} Eur</p>
                        </div>
                    </div>
                    {/* 
                <div className="table-container">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Item Detail</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <p>Colorful Stacking Block Wooden</p>
                                    <a href="/Item Details">Item Details</a>
                                </td>
                                <td>1</td>
                                <td>18.000 Eur</td>
                                <td>18.000 Eur</td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Colorful Stacking Block Wooden</p>
                                    <a href="/Item Details">Item Details</a>
                                </td>
                                <td>1</td>
                                <td>18.000 Eur</td>
                                <td>18.000 Eur</td>
                            </tr>
                        </tbody>
                    </table>
                </div> */}

                    <div className="total">
                        <div className="total-cont">
                            <div className="band">
                                <span>Subtotal</span>
                                <span>{Number(data.total).toFixed(2)} Eur</span>
                            </div>
                            <div className="band">
                                <span>Paid</span>
                                <span>{Number(data.paid).toFixed(2)} Eur</span>
                            </div>
                            <div className="band">
                                <span>Total VAT</span>
                                <span>2.000 Eur</span>
                            </div>
                            <div className="band last-band">
                                <span>Discount</span>
                                <span className="discount">-2.000 Eur</span>
                            </div>
                            <div className="band">
                                <span>Rest Amount</span>
                                <span>{(Number(data.total) - Number(data.paid)).toFixed(2)} Eur</span>

                            </div>
                            <Button className="btn-print text-xl py-4 rounded-xl min-w-32 h-13 submit "
                                onClick={() => window.print()}
                            >{lang === 'en' ? 'Print / Download' : 'طباعة/ تحميل'}</Button>
                            <Button className="btn-print text-xl py-4 rounded-xl min-w-32 h-13 submit bg-[#ECE6F3] text-[#C1092F] "
                                onClick={() => { setData(null); }}
                            >{lang === 'en' ? 'Reset' : 'إعادة'}</Button>
                        </div>
                    </div>

                    <div className="f-footer">
                        <div className="container">
                            <span>#656764-32 . {Number(data.total).toFixed(2)}Eur due {new Date().toDateString()}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="form-container">
                    <div className="book-cont">
                        <div className="w-full form form-contact-alaa ltr">

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(Submit)}>
                                    <FormField name="name" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Full Name' : 'الاسم الكامل'}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === 'en' ? 'Full Name' : 'الاسم الكامل'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField name="company" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Company Name' : 'اسم الشركة'}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === 'en' ? 'Company Name' : 'اسم الشركة'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="address" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Address' : 'العنوان'}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === 'en' ? 'Address' : 'العنوان'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="phone" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Phone' : 'رقم الهاتف'}</FormLabel>
                                            <FormControl><PhoneInput {...field} placeholder={lang === 'en' ? 'Phone' : 'رقم الهاتف'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="email" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Email' : 'البريد الالكتروني'}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === 'en' ? 'Email' : 'البريد الالكتروني'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="total" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel> {lang === "en" ? "Total Amount" : "المبلغ الكلي"}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === "en" ? "Total Amount" : "المبلغ الكلي"} type="number" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="paid" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === "en" ? "Paid" : "المبلغ المدفوع"}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === "en" ? "Paid" : "المبلغ المدفوع"} type="number" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <Button type="submit" className={`text-xl py-4 rounded-xl min-w-32 h-13 submit mt-8`}>{lang === "en" ? "Submit" : "ارسال"}</Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}