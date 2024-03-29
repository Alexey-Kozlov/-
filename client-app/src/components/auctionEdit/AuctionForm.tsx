import { useEffect, useState } from 'react'
import Heading from '../auctionList/Heading'
import { useNavigate, useParams } from 'react-router-dom'
import { Formik, Form, ErrorMessage } from 'formik';
import TextInput from '../inputComponents/TextInput';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Auction, ObjectResponse } from '../../store/types';
import DatePickerInput from '../inputComponents/DatePickerInput';
import ImageFileInput from '../inputComponents/ImageFileInput';
import TextAreaInput from '../inputComponents/TextAreaInput';
import { Button } from 'flowbite-react';
import { useCreateAuctionMutation, useGetDetailedViewDataQuery, useUpdateAuctionMutation } from '../../api/AuctionApi';
import { useGetImageForAuctionQuery } from '../../api/ImageApi';

export default function AuctionForm() {
    let { id } = useParams();
    if (!id) id = 'empty';
    const { data, isLoading, isError } = useGetDetailedViewDataQuery(id!, {
        skip: id === 'empty'
    });

    const [createAuction] = useCreateAuctionMutation();
    const [updateAuction] = useUpdateAuctionMutation();
    const [image, setImage] = useState('');
    const [isWaiting, setIsWaiting] = useState(false);
    const [newAuction, setNewAuction] = useState<Auction>(
        {
            make: '',
            model: '',
            auctionEnd: new Date(),
            image: '',
            color: '',
            year: 0,
            mileage: 0,
            reservePrice: 0,
            description: '',
            error: ''
        } as Auction
    )
    const navigate = useNavigate();
    const auctionImage = useGetImageForAuctionQuery(newAuction.id, {
        skip: newAuction.id == undefined
    });

    useEffect(() => {
        if (!isLoading) {
            if (data) {
                setNewAuction(data!);
            }
        }
    }, [data, isLoading])

    useEffect(() => {
        if (!auctionImage.isLoading && auctionImage.data?.image) {
            setImage('data:image/png;base64, ' + auctionImage?.data?.image);
        }
    }, [auctionImage.isLoading, auctionImage.data?.image])

    if (isLoading) return 'Загрузка...';
    if (isError) {
        navigate('/not-found');
    }

    return (

        <div className='mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg'>
            <>
                <Heading title='Редактирование аукциона' subtitle='Отредактируйте данные ниже' />
                <Formik
                    initialValues={newAuction}
                    enableReinitialize
                    onSubmit={async (values, { setErrors }) => {
                        setIsWaiting(true);
                        if (id !== 'empty') {
                            //обновление аукциона
                            const response: ObjectResponse<Auction> = await updateAuction({
                                id: id,
                                data: JSON.stringify(values)
                            });
                            if (response.data) {
                                toast.success(`Аукцион "${values.model}" успешно обновлен!`);
                                setTimeout(() => {
                                    navigate('/');
                                }, 1000);
                            } else {
                                setErrors({ error: (response.error.data) });
                                toast.error(response.error.data.errorMessages[0]);
                            }
                        } else {
                            //создание аукциона
                            const response: ObjectResponse<Auction> = await createAuction({
                                data: JSON.stringify(values)
                            });
                            if (response.data) {
                                toast.success(`Новый аукцион "${values.model}" успешно создан!`);
                                setTimeout(() => {
                                    navigate('/');
                                }, 1000);

                            } else {
                                setErrors({ error: (response.error.data) });
                                toast.error(response.error.data.errorMessages[0]);
                            }
                        }

                    }
                    }
                    validationSchema={Yup.object({
                        make: Yup.string().required('Необходимо указать производителя товара'),
                        model: Yup.string().required('Необходимо указать наименование товара'),
                        auctionEnd: Yup.date().required('Необходимо указать дату и время окончания акциона')
                    })}
                >
                    {({ handleSubmit, setFieldValue, isSubmitting, errors, isValid, dirty }) => (
                        <Form onSubmit={handleSubmit} autoComplete='off'>
                            <div className='mt-5'>
                                <TextInput
                                    name='make'
                                    placeholder='Производитель'
                                    label='Производитель'
                                    labellWidth='w-[250px]'
                                    inputWidth='w-[237px]'
                                    onChange={() => { }}
                                    required
                                />
                            </div>
                            <div className='mt-5'>
                                <TextInput
                                    name='model'
                                    label='Наименование'
                                    placeholder='Наименование'
                                    labellWidth='w-[250px]'
                                    inputWidth='w-[237px]'
                                    onChange={() => { }}
                                    required
                                />
                            </div>
                            <div className='mt-5'>
                                <DatePickerInput
                                    name='auctionEnd'
                                    label="Дата окончания аукциона"
                                    labellWidth='w-[230px]'
                                    showTimeSelect
                                    showMonthDropdown
                                    showYearDropdown
                                    todayButton="Сегодня"
                                    closeOnScroll={true}
                                    timeCaption='time'
                                    locale='ru'
                                    dateFormat='dd.MM.yyyy HH:mm'
                                    timeIntervals={60}
                                    required
                                />
                            </div>
                            <div className='mt-5'>
                                <ImageFileInput
                                    name='image'
                                    label='Изображение'
                                    value={image}
                                    labellWidth='w-56'
                                    onChange={(imageData: string) => {
                                        setFieldValue('image', imageData);
                                        setImage(imageData);
                                    }}
                                />
                            </div>
                            <div className='mt-5'>
                                <TextInput
                                    name='color'
                                    label='Цвет'
                                    placeholder='Цвет'
                                    labellWidth='w-[250px]'
                                    inputWidth='w-[237px]'
                                    onChange={() => { }}
                                />
                            </div>
                            <div className='mt-5'>
                                <TextInput
                                    name='year'
                                    label='Год выпуска'
                                    placeholder='Год выпуска'
                                    labellWidth='w-[250px]'
                                    inputWidth='w-[237px]'
                                    onChange={() => { }}
                                />
                            </div>
                            <div className='mt-5'>
                                <TextInput
                                    name='mileage'
                                    label='Пробег'
                                    placeholder='Пробег'
                                    labellWidth='w-[250px]'
                                    inputWidth='w-[237px]'
                                    onChange={() => { }}
                                />
                            </div>
                            {id === 'empty' &&
                                <div className='mt-5'>
                                    <TextInput
                                        name='reservePrice'
                                        label='Начальная цена'
                                        type='number'
                                        placeholder='Начальная цена'
                                        labellWidth='w-[250px]'
                                        inputWidth='w-[237px]'
                                        onChange={() => { }}
                                    />
                                </div>
                            }
                            <div className='mt-5'>
                                <TextAreaInput
                                    name='description'
                                    label='Примечание'
                                    placeholder='Примечание'
                                    rows={3}
                                    labellWidth='w-[250px]'
                                    inputWidth='w-[400px]'
                                />
                            </div>
                            <ErrorMessage name='error' render={() =>
                                <p>{errors.error}</p>
                            } />
                            <div className='flex justify-center m-5'>
                                <Button disabled={!isValid || !dirty || isSubmitting}
                                    isProcessing={isSubmitting || isWaiting}
                                    type='submit'>
                                    {id ? 'Сохранить' : 'Создать'}
                                </Button>
                                <Button className='ml-5'
                                    onClick={() => { navigate(-1) }}>
                                    Отмена
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </>

        </div>

    )
}
