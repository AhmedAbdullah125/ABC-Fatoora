'use client'
import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { number, z } from 'zod';
import validator from "validator";
import { Button } from '@/components/ui/button';
import PhoneInput from 'react-phone-number-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';

export default function FormPage() {
    const [lang, setLang] = useState('en');
    const [billNumber, setBillNumber] = useState(1);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedLang = localStorage.getItem('lang');
            if (storedLang) {
                setLang(storedLang);
            }
            if (localStorage.getItem('billNumb')) {
                setBillNumber(Number(localStorage.getItem('billNumb')));
                localStorage.setItem('billNumb', Number(billNumber) + 1);

            }
            else {
                localStorage.setItem('billNumb', 1);
            }
        }
    }, []);
    const [data, setData] = useState(null);
    const isGermanPhone = (value) => {
        if (!value) return true; // allow optional
        const cleaned = String(value).replace(/[\s-]/g, '');
        if (!cleaned.startsWith('+49')) return false;
        // Accept +49 followed by 7 to 13 digits (covers landline and mobile ranges)
        return /^\+49\d{7,13}$/.test(cleaned);
    };
    const formSchema = z.object({
        name: z.string().min(1, { message: "Name is required" }).max(50, { message: "Name must be at most 50 characters" }),
        company: z.string().min(1, { message: "Company name is required" }).max(100, { message: "Name must be at most 50 characters" }),
        phone: z.preprocess(
            (v) => (v === '' || v == null ? undefined : v),
            z.string().refine(isGermanPhone, { message: "Invalid German phone number (use +49 ...)" })
        ).optional(),
        email: z.string().email({ message: "Invalid email address" }),
        address: z.string().max(500, { message: "Address must be at most 500 characters" }).min(1, { message: "Address is required" }),
        total: z.string().min(1, { message: "Total is required" }),
        paid: z.string().min(1, { message: "Paid is required" }),
        Buchung: z.string().min(1, { message: "Buchung is required" }),
        title: z.string().min(1, { message: "Title is required" }),
        title2: z.string().min(1, { message: "Title is required" }),
        title3: z.string().max(200, { message: "Title must be at most 200 characters" }),
        street: z.string().min(1, { message: "Street is required" }),
        companytax: z.string().max(200, { message: "Title must be at most 200 characters" }),
        site: z.string().max(200, { message: "Site must be at most 200 characters" }).min(1, { message: "Street is required" }),
        BillNum: z.string().max(200, { message: "Bill Number must be at most 200 characters" }).min(1, { message: "Street is required" }),

    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            BillNum: "",
            name: '',
            phone: '',
            email: '',
            site: '',
            company: '',
            address: '',
            total: '',
            paid: '',
            Buchung: '',
            title: '',
            title2: '',
            title3: '',
            street: '',
            companytax: '',
        }
    });

    const Submit = (data) => {
        setData(data);
    };

    const formattedDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
    console.log(formattedDate);

    return (
        <div className="book-main-page">
            {data ? (
                <div className="container">
                    <div className="n-header">
                        {/* <Image src={logo} alt="logo" width={100} height={100} className="logo" /> */}

                        <h2>Rechnung</h2>
                        <span></span>
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
                            {data.companytax ? <span className="receiver-company">ust : {data.companytax}</span> : null}
                            <span className="receiver-address">{data.address}</span>
                            <span className="receiver-address">{data.street}</span>
                            <span className="receiver-phone">{data.phone}</span>
                            <span className="receiver-email">{data.email}</span>
                        </div>
                        <div className="part">
                            <div className="semi-part">
                                <h3>Rechnungsdatum</h3>
                                <span className="invoice-date">{formattedDate}</span>
                            </div>
                            <div className="semi-part">
                                <h3>Rechnungsnummer</h3>
                                <span className="invoice-no">{data.BillNum}</span>
                            </div>
                            <div className="semi-part">
                                <h3>Buchungsnummer</h3>
                                <span className="invoice-no">{data.Buchung}</span>
                            </div>
                            <div className="semi-part">
                                <h3>Buchungsseite:</h3>
                                <span className="invoice-no">{data.site}</span>
                            </div>
                        </div>
                    </div>
                    <div className="description">
                        <p>
                            <span>{data.title}</span>

                            <span>{data.title2}</span>

                            <span>{data.title3} Person</span>
                        </p>
                    </div>
                    {/* <div className="due">
                        <span>Kommissionsfähiger Betrag:</span>
                        <div className="due-amount">
                            <p>{Number(data.total).toFixed(2)} Euro</p>
                        </div>
                    </div> */}
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
                        <h3>Preisdetails</h3>
                        <div className="total-cont">
                            <div className="band">
                                <span>Betrag an Gastgeber</span>
                                <span>{(Number(data.total) - Number(data.paid)).toFixed(2)} Euro</span>

                            </div>
                            <div className="band ">
                                <span>Kommission an Booking</span>
                                <span>{Number(data.paid).toFixed(2)} Euro</span>
                            </div>

                            {/* <div className="band ">
                                <span>Steuerjahr, Kleinerunternehmen</span>
                                <span>{Number(data.Steuerjahr).toFixed(2)} Euro</span>
                                </div> */}
                            {/* <div className="band ">
                                <span>Discount</span>
                                <span className="discount">-2.000 Euro</span>
                                </div> */}
                            <div className="band">
                                <span>Gesamt Betrag</span>
                                <span>{Number(data.total).toFixed(2)} Euro</span>
                            </div>
                            <div className="band low-word">
                                <span>Steuerfrei, kleinunternehmen §19 ustg</span>

                            </div>

                            <Button className="btn-print text-xl py-4 rounded-xl min-w-32 h-13 submit "
                                onClick={() => window.print()}
                            >{lang === 'en' ? 'Print / Download' : 'طباعة/ تحميل'}</Button>
                            <Button className="btn-print text-xl py-4 rounded-xl min-w-32 h-13 submit bg-[#ECE6F3] text-[#C1092F] "
                                onClick={() => { setData(null); }}
                            >{lang === 'en' ? 'Reset' : 'إعادة'}</Button>
                        </div>
                    </div>

                    {/* <div className="f-footer">
                      
                        <div className="container nnew">
                            <span>#{data.Buchung} . {Number(data.total).toFixed(2)} Euro due {formattedDate}</span>
                        </div>
                    </div> */}
                </div>
            ) : (
                <div className="form-container">
                    <div className="book-cont">
                        <div className="w-full form form-contact-alaa ltr">

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(Submit)}>
                                    <FormField name="BillNum" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Rechnungsnummer' : 'رقم الفاتورة'}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === 'en' ? 'Rechnungsnummer' : 'رقم الفاتورة'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField name="name" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Vollständiger Name' : 'الاسم الكامل'}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === 'en' ? 'Vollständiger Name' : 'الاسم الكامل'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField name="company" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Name der Firma' : 'اسم الشركة'}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === 'en' ? 'Name der Firma' : 'اسم الشركة'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField name="companytax" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Steuernummer der Firma' : 'رقم الشركه الضريبي'}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === 'en' ? 'Steuernummer der Firma' : 'رقم الشركه الضريبي'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="address" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Adresse' : 'العنوان'}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === 'en' ? 'Adresse' : 'العنوان'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField name="street" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Straßennahme' : 'الشارع'}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === 'en' ? 'Straßennahme' : 'الشارع'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="phone" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Telefon' : 'رقم الهاتف'}</FormLabel>
                                            <FormControl><PhoneInput {...field} placeholder={lang === 'en' ? 'Telefon' : 'رقم الهاتف'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="email" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'E-Mail' : 'البريد الالكتروني'}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === 'en' ? 'E-Mail' : 'البريد الالكتروني'} /></FormControl>
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
                                    <FormField name="title" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Apartmentnahm' : 'العنوان الرئيسي'}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === 'en' ? 'Apartmentnahm' : 'العنوان الرئيسي'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField name="title2" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Buchungstermine' : 'مواعيد الحجز'}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === 'en' ? 'Buchungstermine' : 'مواعيد الحجز'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField name="title3" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Buchungspersonen' : 'عدد الافراد'}</FormLabel>
                                            <FormControl><Input type="number" {...field} placeholder={lang === 'en' ? 'Buchungspersonen' : 'عدد الافراد'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />


                                    <FormField name="site" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel> {lang === "en" ? " Buchungsseite:" : "موقع الحجز: "}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === "en" ? "Buchungsseite:" : "موقع الحجز:"} type="text" /></FormControl>
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
                                    {/* <FormField name="Steuerjahr" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === "en" ? "Steuerjahr, Kleinerunternehmen" : "السنة الضريبية، الأعمال الصغيرة"}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === "en" ? "steuerjahr" : "السنة الضريبية"} type="number" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} /> */}

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