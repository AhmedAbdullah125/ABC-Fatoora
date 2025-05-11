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
        paid: z.string().min(1, { message: "Paid is required" }),
        Buchung : z.string().min(1, { message: "Buchung is required" }),
        Steuerjahr : z.string().min(1, { message: "Steuerjahr is required" }),
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
            paid: '',
            Buchung: '',
            Steuerjahr: '',
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
                        <h2>Rechnung</h2>
                    </div>

                    <div className="letter-details">
                        <div className="part">
                            <h3>Von</h3>
                            <h4 className="sender-name">Ahmed Elsayed</h4>
                            <span className="sender-address">Hafenstraße 2, 25436 Uetersen</span>
                            <span className="sender-phone">+49 1550 61785042</span>
                            <span className="sender-mail">ahmed.abdullah.eg8791@gmail.com</span>
                            <span className="sender-taxid">Steuer ID Nr : 98 206 153 544</span>
                            <span className="sender-taxid">ust : 13/105/01007</span>
                        </div>
                        <div className="part">
                            <h3>Zum</h3>
                            <h4 className="receiver-name">{data.name}</h4>
                            <span className="receiver-company">{data.company}</span>
                            <span className="receiver-address">{data.address}</span>
                            <span className="receiver-phone">{data.phone}</span>
                            <span className="receiver-email">{data.email}</span>
                        </div>
                        <div className="part">
                            <div className="semi-part">
                                <h3>Buchung Nummer</h3>
                                <span className="invoice-no">#{data.Buchung}</span>
                            </div>
                            <div className="semi-part">
                                <h3>Rechnungsdatum</h3>
                                <span className="invoice-date">{new Date().toDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="description">
                        <p>
                            <span>Gebucht: Apartment - Erdgeschoss ( Family - Friendly rental flat)</span>

                            <span>Check in 08.05.2025 Check Out 09.05.2025</span>

                            <span> 1 Person</span>
                        </p>
                    </div>
                    <div className="due">
                        <span>Kommissionsfähiger Betrag:</span>
                        <div className="due-amount">
                            <p>{Number(data.total).toFixed(2)} Euro</p>
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
                                <td>18.000 Euro</td>
                                <td>18.000 Euro</td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Colorful Stacking Block Wooden</p>
                                    <a href="/Item Details">Item Details</a>
                                </td>
                                <td>1</td>
                                <td>18.000 Euro</td>
                                <td>18.000 Euro</td>
                            </tr>
                        </tbody>
                    </table>
                </div> */}

                    <div className="total">
                        <div className="total-cont">
                            <div className="band">
                                <span>Kommissionsfähiger Betrag</span>
                                <span>{Number(data.total).toFixed(2)} Euro</span>
                            </div>
                            <div className="band">
                                <span>Der bei der Buchung einer Unterkunft gezahlte Betrag</span>
                                <span>{Number(data.paid).toFixed(2)} Euro</span>
                            </div>
                            <div className="band last-band">
                                <span>Steuerjahr, Kleinerunternehmen</span>
                                <span>{Number(data.Steuerjahr).toFixed(2)} Euro</span>
                            </div>
                            {/* <div className="band ">
                                <span>Discount</span>
                                <span className="discount">-2.000 Euro</span>
                            </div> */}
                            <div className="band">
                                <span>Der bei der Buchung einer Unterkunft gezahlte Betrag</span>
                                <span>{(Number(data.total) - Number(data.paid)).toFixed(2)} Euro</span>

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
                            <span>#656764-32 . {Number(data.total).toFixed(2)}Euro due {new Date().toDateString()}</span>
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
                                    <FormField name="Buchung" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Buchung Nummer' : 'رقم الحجز'}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === 'en' ? 'Buchung Nummer' : 'رقم الحجز'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="total" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel> {lang === "en" ? "Kommissionsfähiger Betrag:" : "مبلغ العمولة: "}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === "en" ? "Kommissionsfähiger Betrag" : "مبلغ العمولة:"} type="number" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="paid" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === "en" ? "Kommission und Gebühren" : "العمولة والرسوم"}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === "en" ? "Kommission und Gebühren" : "العمولة والرسوم"} type="number" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    {/* <FormField name="Buchung" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === "en" ? "Der bei der Buchung einer Unterkunft gezahlte Betrag" : "المبلغ المدفوع عند حجز الإقامة"}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === "en" ? "Kommission und Gebühren" : "العمولة والرسوم"} type="number" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} /> */}
                                    <FormField name="Steuerjahr" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === "en" ? "Steuerjahr, Kleinerunternehmen" : "السنة الضريبية، الأعمال الصغيرة"}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === "en" ? "steuerjahr" : "السنة الضريبية"} type="number" /></FormControl>
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