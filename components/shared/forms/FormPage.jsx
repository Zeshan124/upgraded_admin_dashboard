import { useState, useEffect } from "react";
import Editor from "~/components/shared/UI/Editor";
import { addPage, updatePage } from '~/api/PagesServices';
import useMessageHandler from '~/components/hooks/useMessageHandler';
import ErrorBoundary from '~/components/utils/ErrorBoundary';
import { Spin } from "antd";


const initialData = {
    index: '',
    name: '',
    title: '',
}
const FormPage = ({ pageData = null }) => {
    const [value, setValue] = useState('');
    const [valueUrdu, setValueUrdu] = useState('');
    const [formData, setFormData] = useState(initialData);
    const [isLoading, setIsLoading] = useState('');
    const [editorLoaded, setEditorLoaded] = useState(false);
    const { showSuccess, showError, contextHolder } = useMessageHandler();
   
    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    useEffect(() => {
        if (pageData){
            setFormData({
                index:  pageData ? pageData.index : '',
                name:   pageData ? pageData.name : '',
                title:  pageData ? pageData.title : '',
            })
            setValue(pageData?.contentEnglish);
            setValueUrdu(pageData?.contentUrdu);
        }
    }, [pageData]);

    const formOnChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const submitFormHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true)
        if (!value.trim() || value.trim()==="") {
            showError('Please write something.');
            setIsLoading(false)
            return;
        }
        
        try {
            
            let response;
            if (pageData) {
                // console.log({ pageID: pageData.id, ...formData, content: value })
                response = await updatePage({ pageID: pageData.pageID, ...formData, contentEnglish: value, contentUrdu: valueUrdu  });
            } else {
                response = await addPage({ ...formData, content: value, contentEnglish: value, contentUrdu: valueUrdu });
            }
            // console.log(response,'response')
            if (response && response?.status === 200) {
                showSuccess(response?.data?.message || response?.message || 'Operation successful');
            }else{
                throw new Error(response?.data?.message || response?.message || 'Failed to complete operation');
            }
           
        } catch (error) {

            showError('Error during operation');
            console.error('Error Posting:', error);
        }
        finally{
            setIsLoading(false)
        }
    };
    return (
        <ErrorBoundary>
            {contextHolder}
        <figure className="ps-block--form-box">
            <figcaption className="text-white text-center mb-4">Create Page</figcaption>
        <form onSubmit={submitFormHandler} className="ps-form ps-form--new px-2" >
            <div className="row">
                        <div className="col-12 col-lg-6 form-group">
                            <label>Name<sup>*</sup></label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter Menu Name"
                                name="name"
                                onChange={formOnChangeHandler}
                                value={formData.name}
                            />
                        </div>
                        <div className="col-12 col-lg-6 form-group">
                            <label>Index<sup>*</sup></label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Index (Fardeen Farmaish)"
                                name="index"
                                onChange={formOnChangeHandler}
                                value={formData.index}
                            />
                        </div>
            </div>
            
            <div className="form-group">
                <label>Title<sup>*</sup></label>
                <input
                    className="form-control"
                    type="text"
                    placeholder="Title(heading on top of page)"
                    name="title"
                    onChange={formOnChangeHandler}
                    value={formData.title}
                />
            </div>
            
            <div className="form-group w-100 mw-100">
                <label>
                    Write English Content:<sup>*</sup>
                </label>
                <div className="w-100 mw-100">
                    <Editor
                        name="pages"
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setValue(data); // Set the value to the form field
                        }}
                        value={value}
                        editorLoaded={editorLoaded}
                        
                    />
            </div>
                
                        <div className="form-group w-100 mw-100">
                            <label>
                                Write Urdu Content:<sup>*</sup>
                            </label>
                            <div className="w-100 mw-100">
                                <Editor
                                    name="pages"
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setValueUrdu(data); // Set the value to the form field
                                    }}
                                    value={valueUrdu}
                                    editorLoaded={editorLoaded}

                                />
                            </div>
                        </div>
            </div>
            <div className="ps-form__bottom">
                <div className="ps-btn ps-btn--black" onClick={() => (router.push('/custom-pages'))}>
                    Back
                </div>
                {/* <button className="ps-btn ps-btn--gray">Cancel</button> */}
                <button className="ps-btn" type="submit" disabled={isLoading} >Submit {isLoading && <Spin />}</button>
            </div>
  
        </form >
    </figure>
    </ErrorBoundary>
    )
}

export default FormPage



