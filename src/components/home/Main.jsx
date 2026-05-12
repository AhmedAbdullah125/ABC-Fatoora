'use client'
import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import PhoneInput from 'react-phone-number-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
                localStorage.setItem('billNumb', Number(localStorage.getItem('billNumb')) + 1);
            }
            else {
                localStorage.setItem('billNumb', 1);
            }
        }
    }, []);

    const isGermanPhone = (value) => {
        if (!value) return true; // allow optional
        const cleaned = String(value).replace(/[\s-]/g, '');
        if (!cleaned.startsWith('+49')) return false;
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

    const watchedData = form.watch();

    const formattedDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');

    const getPdfOptions = () => ({
        margin: [0.3, 0.3, 0.3, 0.3],
        filename: `Rechnung_${watchedData?.BillNum || 'Invoice'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    });

    const handleDownloadPdf = async () => {
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const element = document.getElementById('invoice-content');
            await html2pdf().set(getPdfOptions()).from(element).save();
        } catch (error) {
            console.error('Error generating PDF', error);
        }
    };

    const handleSharePdf = async () => {
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const element = document.getElementById('invoice-content');
            const pdfOutput = await html2pdf().set(getPdfOptions()).from(element).output('blob');

            if (navigator.canShare && navigator.canShare({ files: [new File([pdfOutput], getPdfOptions().filename, { type: 'application/pdf' })] })) {
                const file = new File([pdfOutput], getPdfOptions().filename, { type: 'application/pdf' });
                await navigator.share({
                    files: [file],
                    title: 'Rechnung',
                    text: 'Hier ist Ihre Rechnung'
                });
            } else {
                alert(lang === 'en' ? 'Sharing not supported on this device/browser' : 'المشاركة غير مدعومة في هذا المتصفح');
            }
        } catch (error) {
            console.error('Error sharing PDF', error);
        }
    };

    return (
        <div className="w-full bg-gray-50 min-h-screen p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1600px] mx-auto items-start">
                {/* Form Column */}
                <div className="w-full space-y-6 print:hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">{lang === 'en' ? 'Invoice Generator' : 'منشئ الفواتير'}</h1>
                        <Button variant="outline" onClick={() => form.reset()}>{lang === 'en' ? 'Clear Form' : 'مسح النموذج'}</Button>
                    </div>

                    <Form {...form}>
                        <form className="space-y-6 ltr">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{lang === 'en' ? 'Invoice Details' : 'تفاصيل الفاتورة'}</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField name="BillNum" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === 'en' ? 'Rechnungsnummer' : 'رقم الفاتورة'}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === 'en' ? 'Rechnungsnummer' : 'رقم الفاتورة'} /></FormControl>
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
                                    <FormField name="site" control={form.control} render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>{lang === "en" ? "Buchungsseite:" : "موقع الحجز:"}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === "en" ? "Buchungsseite:" : "موقع الحجز:"} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{lang === 'en' ? 'Customer Information' : 'معلومات العميل'}</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>{lang === 'en' ? 'Steuernummer der Firma' : 'رقم الشركه الضريبي'}</FormLabel>
                                            <FormControl><Input {...field} placeholder={lang === 'en' ? 'Steuernummer der Firma' : 'رقم الشركه الضريبي'} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{lang === 'en' ? 'Address Details' : 'تفاصيل العنوان'}</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{lang === 'en' ? 'Contact Information' : 'معلومات الاتصال'}</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{lang === 'en' ? 'Booking Details & Amounts' : 'تفاصيل الحجز والمبالغ'}</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField name="title" control={form.control} render={({ field }) => (
                                        <FormItem className="md:col-span-2">
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
                                    <FormField name="total" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{lang === "en" ? "Kommissionsfähiger Betrag:" : "مبلغ العمولة: "}</FormLabel>
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
                                </CardContent>
                            </Card>
                        </form>
                    </Form>
                </div>

                {/* Preview Column */}
                <div className="w-full lg:sticky lg:top-4 print:relative print:w-full print:block print:!top-0">
                    <Card className="overflow-hidden bg-white shadow-xl flex flex-col print:shadow-none print:border-none">
                        <div className="bg-gray-100 p-4 border-b flex flex-wrap gap-4 items-center justify-between shrink-0 print:hidden">
                            <h2 className="font-semibold text-lg">{lang === 'en' ? 'Live Preview' : 'معاينة مباشرة'}</h2>
                            <div className="flex gap-2">
                                <Button onClick={() => window.print()} variant="secondary" className="btn-print">
                                    {lang === 'en' ? 'Print' : 'طباعة'}
                                </Button>
                                <Button onClick={handleDownloadPdf} className="btn-print">
                                    {lang === 'en' ? 'Download PDF' : 'تحميل PDF'}
                                </Button>
                                <Button onClick={handleSharePdf} variant="outline" className="btn-print">
                                    {lang === 'en' ? 'Share' : 'مشاركة'}
                                </Button>
                            </div>
                        </div>

                        {/* Invoice Container - Keeping exact structure for styling compatibility */}
                        <div className="p-4 md:p-8 overflow-y-auto max-h-[85vh] print:max-h-none print:overflow-visible bg-white w-full flex justify-center print:p-0">
                            <div className="book-main-page w-full" style={{ padding: 0 }}>
                                <div className="container" id="invoice-content" style={{ margin: 0, padding: 0, width: '100%', minHeight: 'auto' }}>
                                    <div className="n-header">
                                        <h2>Rechnung</h2>
                                        <span></span>
                                    </div>

                                    <div className="letter-details">
                                        <div className="part">
                                            <h3>Von</h3>
                                            <h4 className="sender-name">Ahmed Elsayed</h4>
                                            <span className="sender-address">Hafenstraße 2, 25436 Uetersen</span>
                                            <span className="sender-phone">+4917672480583</span>
                                            <span className="sender-mail">ahmed.abdullah.eg8791@gmail.com</span>
                                            <span className="sender-taxid">Steuer ID Nr : 98 206 153 544</span>
                                            <span className="sender-taxid">ust : 13/105/01007</span>
                                        </div>
                                        <div className="part">
                                            <h3>Zum</h3>
                                            <h4 className="receiver-name">{watchedData.name || '---'}</h4>
                                            <span className="receiver-company">{watchedData.company || '---'}</span>
                                            {watchedData.companytax ? <span className="receiver-company">ust : {watchedData.companytax}</span> : null}
                                            <span className="receiver-address">{watchedData.address || '---'}</span>
                                            <span className="receiver-address">{watchedData.street || '---'}</span>
                                            <span className="receiver-phone">{watchedData.phone || '---'}</span>
                                            <span className="receiver-email">{watchedData.email || '---'}</span>
                                        </div>
                                        <div className="part">
                                            <div className="semi-part">
                                                <h3>Rechnungsdatum</h3>
                                                <span className="invoice-date">{formattedDate}</span>
                                            </div>
                                            <div className="semi-part">
                                                <h3>Rechnungsnummer</h3>
                                                <span className="invoice-no">{watchedData.BillNum || '---'}</span>
                                            </div>
                                            <div className="semi-part">
                                                <h3>Buchungsnummer</h3>
                                                <span className="invoice-no">{watchedData.Buchung || '---'}</span>
                                            </div>
                                            <div className="semi-part">
                                                <h3>Buchungsseite:</h3>
                                                <span className="invoice-no">{watchedData.site || '---'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="description">
                                        <p>
                                            <span>{watchedData.title || '---'}</span>
                                            <span>{watchedData.title2 || '---'}</span>
                                            <span>{watchedData.title3 ? `${watchedData.title3} Person` : '---'}</span>
                                        </p>
                                    </div>

                                    <div className="total">
                                        <h3>Preisdetails</h3>
                                        <div className="total-cont">
                                            <div className="band">
                                                <span>Betrag an Gastgeber</span>
                                                <span>{watchedData.total && watchedData.paid ? (Number(watchedData.total) - Number(watchedData.paid)).toFixed(2) : '0.00'} Euro</span>
                                            </div>
                                            <div className="band">
                                                <span>Kommission an Booking</span>
                                                <span>{watchedData.paid ? Number(watchedData.paid).toFixed(2) : '0.00'} Euro</span>
                                            </div>
                                            <div className="band">
                                                <span>Gesamt Betrag</span>
                                                <span>{watchedData.total ? Number(watchedData.total).toFixed(2) : '0.00'} Euro</span>
                                            </div>
                                            <div className="bank-details">
                                                <h3>Bankdaten:</h3>
                                                <div className="band">
                                                    <span>Empfänger:</span>
                                                    <span>Ahmed Elsayed</span>
                                                </div>
                                                <div className="band">
                                                    <span>IBAN:</span>
                                                    <span>DE21 1001 0178 0931 0448 90</span>
                                                </div>
                                                <div className="band">
                                                    <span>BIC:</span>
                                                    <span>REVODEB2</span>
                                                </div>
                                                <div className="band">
                                                    <span>Nahme der Bank:</span>
                                                    <span>Revolut UAB</span>
                                                </div>
                                            </div>
                                            <div className="band low-word">
                                                <span>Steuerfrei, kleinunternehmen §19 ustg</span>
                                            </div>
                                            <div className="band low-word">
                                                <span> </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}