<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\AchModel;
use App\RegionsModel;
use App\RegistrationPaymentModel;
use App\RegistrationModel;
use App\RepaymentModel;
use App\RepaymentAchsModel;
use App\RepaymentAmountsModel;
use App\BankNameModel;
use App\RegistrationFeesModel;
use App\SahyognidhiManpowerRefundpaymentAmounts;
use App\SahyognidhiManpowerFinalRefundamounts;
use App\SahyognidhiManpowerModel;
use App\LedgerAccountModel;
use App\BankChargesModel;
use App\SahyognidhiRequestModel;
use App\SahyognidhiAmountModel;
use App\SahyognidhiPaymentModel;
use Input;
use Validator;
use Auth;
use session;
use DB;
/*use Maatwebsite\Excel\Concerns\WithMultipleSheets;*/
//use Excel;
/*use App\Exports\ExportUsers;
use App\Imports\ImportUsers;
use Maatwebsite\Excel\Facades\Excel;*/
/*use Maatwebsite\Excel\Facades\Excel;*/

class RepaymentController extends Controller
{
    /* private $exporter;
     private $excel;

    public function __construct(Excel $excel)
    {
        
        
        $this->excel = $excel;
    }
    */

    public function index($ach=0)
    {
        $divangat = array();
        $totalAmount = array();
        $countSahyognidhiRequest = array();
        $registrationData = array();
	$startYear = date("Y",strtotime("-1 year"));
        $endyear = date("Y");
        $startYear = $startYear;
        $startDay = 1;
        $startMonth = 4;
        $startDate = strftime("%F", strtotime($startYear."-".$startMonth."-".$startDay));
        $EndYear =  $endyear;
        $endDay = 1;
        $endMonth = 4;
        $endDate = strftime("%F", strtotime($EndYear."-".$endMonth."-".$endDay)); 
       $sahyognidhiData = SahyognidhiRequestModel::where('status','!=','3')->get();
       $sahyognidhipending = SahyognidhiRequestModel::where('status','0')->get();
       $totalcheqbounce = RepaymentAmountsModel::where('bounce_status',2)->where('start_year','<=',$startYear)->where('end_year','>=',$endyear)->get();
       $totalACHBounce = RepaymentAmountsModel::where('bounce_status',1)->where('start_year','<=',$startYear)->where('end_year','>=',$endyear)->get();
       foreach ($sahyognidhiData as $key => $value) {
            if ($value['sahyognidhi_date'] >= $startDate && $value['sahyognidhi_date'] <= $endDate) {
                $countSahyognidhiRequest[] = SahyognidhiRequestModel::where('status','!=','3')->where('sahyognidhi_date',$value['sahyognidhi_date'])->get()->toArray();
                $divangatAmount = SahyognidhiRequestModel::where('status','!=','3')->where('sahyognidhi_date',$value['sahyognidhi_date'])->first();
                $divangat[] = $divangatAmount['sahyognidhi_request'];
                $registration = RegistrationModel::where('status','!=','3')->where('ysk_id',$divangatAmount['fk_ysk_id'])->orWhere('pre_ysk_id',$divangatAmount['fk_ysk_id'])->get()->toArray();
                $registrationData[] = array_pop($registration);
                $getAmount = SahyognidhiAmountModel::where('status','1')->where('start_date','<=',$value['sahyognidhi_date'])->where('end_date','>=',$value['sahyognidhi_date'])->get()->toArray();
                if (count($getAmount) == '0'){
                $getAmount = SahyognidhiAmountModel::where('status','1')->where('start_date','<=',$value['sahyognidhi_date'])->where('end_date','0000-00-00')->get()->toArray();
            }
            }
        }
        for ($i=0; $i < count($divangat); $i++) { 
            if ($divangat[$i] == 'Devantage') {
                $totalAmount[] = $getAmount[0]['divangate_amount'];
            }
            if ($divangat[$i] == 'Half Disability') {
                $totalAmount[] = ($getAmount[0]['divangate_amount'])/2;
            }
            if ($divangat[$i] == 'Full Disability') {
                $totalAmount[] = $getAmount[0]['divangate_amount'];
            }
        }
        $sum = array();
        $sum = $sum + $totalAmount;
        $regionData        = RegionsModel::where('status','1')->get();
        if($ach == 0) {
            $RepaymentModel = RepaymentModel::select('repayments.*',
                        'regions.region_name',
                        'regions.region_code')
                    ->leftJoin('regions','regions.region_id','=','repayments.fk_region_id')
                    ->groupBy('repayments.fk_registration_id')
                    ->orderBy('repayments.repayment_id','ASC')
                    ->get();
                    ;
        }
        $sahyognidhiPaymentpaid = SahyognidhiPaymentModel::where('status','!=','3')->groupBy('fk_sahyognidhi_id')->get()->toArray();
        $sahyognidhiPaymentamount = SahyognidhiPaymentModel::where('status','!=','3')->sum('sahyognidhi_amount');

            if($ach == 1) {
                $RepaymentModel = RepaymentModel::select('repayments.*',
                    'regions.region_name',
                    'regions.region_code')
                ->leftJoin('regions','regions.region_id','=','repayments.fk_region_id')
                ->groupBy('repayments.fk_registration_id')
                ->orderBy('repayments.repayment_id','ASC')
                ->where('payment_status',1)->get();
            }

            if($ach == 2) {
                $RepaymentModel = RepaymentModel::select('repayments.*',
                    'regions.region_name',
                    'regions.region_code')
                ->leftJoin('regions','regions.region_id','=','repayments.fk_region_id')
                ->groupBy('repayments.fk_registration_id')
                    ->orderBy('repayments.repayment_id','ASC')
                ->where('payment_status',1)->where('payment_completed',0)->get();
            }

            if($ach == 3) {
                $RepaymentModel = RepaymentModel::select('repayments.*',
                    'regions.region_name',
                    'regions.region_code')
                ->leftJoin('regions','regions.region_id','=','repayments.fk_region_id')
                ->groupBy('repayments.fk_registration_id')
                    ->orderBy('repayments.repayment_id','ASC')
                ->where('payment_status',1)->where('payment_completed',1)->get();
            }

            if($ach == 4) {
                $RepaymentModel = RepaymentModel::select('repayments.*',
                    'regions.region_name',
                    'regions.region_code')
                ->leftJoin('regions','regions.region_id','=','repayments.fk_region_id')
                ->groupBy('repayments.fk_registration_id')
                    ->orderBy('repayments.repayment_id','ASC')
                ->where('payment_status',1)->where('payment_completed',0)->where('bounce_status',1)->get();
            }
            //dd($RepaymentModel);
            $bankName        = LedgerAccountModel::where('fk_group_id','14')->get();

        return view('admin.repayment')->with(["sahyognidhiPaymentpaid" => count($sahyognidhiPaymentpaid),"sahyognidhiPaymentamount" => $sahyognidhiPaymentamount,"countSahyognidhiRequest" => count($countSahyognidhiRequest),"totalSahyognidhiAmount" => array_sum($sum),'regionData' => $regionData,'RepaymentModel' =>$RepaymentModel,'bankName'=>$bankName,'ach'=>$ach,'sahyognidhipending'=>count($sahyognidhipending),'totalcheqbounce'=>count($totalcheqbounce),'totalACHBounce'=>count($totalACHBounce)]);
    }

    public function RepaymentAmount(Request $request){
        //dd(Input::all());
        $id = Input::get('id');
        $getLastYearAmount = SahyognidhiManpowerModel::where('sahyognidhi_manpower_id','=',$id)->get();
        if(count($getLastYearAmount)){
            $startYear = $getLastYearAmount[0]['start_year'];
            $EndYear = $getLastYearAmount[0]['end_year'];
        }
        $RegistrationPeople = RegistrationModel::where('status','1')->get();
        if(count($RegistrationPeople)>0){

            foreach ($RegistrationPeople as $key => $value) {
                
                $RegistrationFee =  RegistrationFeesModel::orderBy('registration_fees_id','DESC')->take(1)->get()->toArray();

                $RefundpaymentAmountsFinal = SahyognidhiManpowerFinalRefundamounts::where('fk_sahyognidhi_manpower_id','=',$id)->get();
                if(count($RegistrationFee) >0 ){
                    
                    $getgroup1 = RegistrationModel::where('registration_id',$value['registration_id'])->where('age','>=',$RegistrationFee[0]['start_age1'])->where('age','<=',$RegistrationFee[0]['end_age1'])->get();
                    if(count($getgroup1)>0){
                        $repaymentAmount =  $RefundpaymentAmountsFinal[0]['group1roudup'];
                    }

                    $getgroup2 = RegistrationModel::where('registration_id',$value['registration_id'])->where('age','>=',$RegistrationFee[0]['start_age2'])->where('age','<=',$RegistrationFee[0]['end_age2'])->get();
                     if(count($getgroup2)>0){
                        
                        $repaymentAmount =  $RefundpaymentAmountsFinal[0]['group2roudup'];
                    }

                    $getgroup3 = RegistrationModel::where('registration_id',$value['registration_id'])->where('age','>=',$RegistrationFee[0]['start_age3'])->where('age','<=',$RegistrationFee[0]['end_age3'])->get();
                     if(count($getgroup3)>0){
                        $repaymentAmount =  $RefundpaymentAmountsFinal[0]['group3roudup'];
                    }

                    $getgroup4 = RegistrationModel::where('registration_id',$value['registration_id'])->where('age','>=',$RegistrationFee[0]['start_age4'])->where('age','<=',$RegistrationFee[0]['end_age4'])->get();
                     if(count($getgroup4)>0){
                        $repaymentAmount =  $RefundpaymentAmountsFinal[0]['group4roudup'];
                    }
                }
                if($value['ysk_id']!=''){
                    $yskId = $value['ysk_id'];
                }else{
                    $yskId = $value['pre_ysk_id'];
                }
                $addAch = AchModel::where('fk_ysk_id',$yskId)->get();
                if(count($addAch)>0){
                    $paymentStatus = '1';
                }else{
                    $paymentStatus = '0';
                }
                $paymentStatusCompleted = RepaymentModel::where('fk_registration_id',$value['registration_id'])->get();
                if(count($paymentStatusCompleted)>0){
                    if($paymentStatusCompleted[0]['status'] == '1'){

                        $data = RepaymentModel::where('fk_registration_id',$value['registration_id'])->update([
                            'status'=> '0',
                        ]);
                    }
                }
                $data = RepaymentModel::create([
                    'fk_registration_id'=> $value['registration_id'], 
                    'fk_region_id'      => $value['fk_region_id'], 
                    'ysk_id'            => $yskId, 
                    'name'              => $value['name_as_per_yuva_sangh_org'], 
                    'phone_number_first'=> $value['phone_number_first'], 
                    'ysk_confirmation_date'=> $value['ysk_confirmation_date'], 
                    'start_year'        => $startYear, 
                    'end_year'          => $EndYear, 
                    'age'               => $value['age'], 
                    'amount'            => $repaymentAmount, 
                    'status'            => '0', 
                    'payment_status'    =>  $paymentStatus, 
                    'created_by'        =>  Auth::user()->fk_role_id,
                ]);
                $insertId  = $data['repayment_id'];

                $RepaymentAmounts = RepaymentAmountsModel::create([
                    'fk_repayment_id'    =>  $insertId, 
                    'fk_registration_id' =>  $value['registration_id'] ,
                    'fk_region_id'      => $value['fk_region_id'], 
                    'ysk_id'             =>  $yskId, 
                    'start_year'         =>  $startYear, 
                    'end_year'           =>  $EndYear, 
                    'repayment_amount'   =>  $repaymentAmount, 
                    'delay_charge'       =>  '0', 
                    'Cheque_bounce'      =>  '0', 
                    'ach_bounce'         =>  '0', 
                    'payment_status'     =>  $paymentStatus, 
                    'bounce_status'      =>  '0', 
                    'payment_completed'  =>  '0', 
                    'created_by'         =>  Auth::user()->fk_role_id,
                    ]);
            }

        }

          $RegistrationPeopleysk = RegistrationModel::where('status','7')->get();
        if(count($RegistrationPeopleysk)>0){

            foreach ($RegistrationPeopleysk as $key => $value) {
                
                $RefundpaymentAmountsFinal = SahyognidhiManpowerFinalRefundamounts::where('fk_sahyognidhi_manpower_id','=',$id)->get();
                $getgroup1 = RegistrationModel::where('registration_id',$value['registration_id'])->get();
                        if(count($getgroup1)>0){
                            $repaymentAmount =  $RefundpaymentAmountsFinal[0]['group5roudup'];
                        }

                if($value['ysk_id']!=''){
                    $yskId = $value['ysk_id'];
                }else{
                    $yskId = $value['pre_ysk_id'];
                }
                $addAch = AchModel::where('fk_ysk_id',$yskId)->get();
                if(count($addAch)>0){
                    $paymentStatus = '1';
                }else{
                    $paymentStatus = '0';
                }
                $paymentStatusCompleted = RepaymentModel::where('fk_registration_id',$value['registration_id'])->get();
                if(count($paymentStatusCompleted)>0){
                    if($paymentStatusCompleted[0]['status'] == '1'){

                        $data = RepaymentModel::where('fk_registration_id',$value['registration_id'])->update([
                            'status'=> '0',
                        ]);
                    }
                }
                $data = RepaymentModel::create([
                    'fk_registration_id'=> $value['registration_id'],
                    'fk_region_id'      => $value['fk_region_id'],
                    'ysk_id'            => $yskId,
                    'name'              => $value['name_as_per_yuva_sangh_org'],
                    'phone_number_first'=> $value['phone_number_first'],
                    'ysk_confirmation_date'=> $value['ysk_confirmation_date'], 
                    'start_year'        => $startYear, 
                    'end_year'          => $EndYear,  
                    'age'               => $value['age'], 
                    'amount'            => $repaymentAmount, 
                    'status'            => '0', 
                    'payment_status'    =>  $paymentStatus, 
                    'created_by'        =>  Auth::user()->fk_role_id,
                ]);
                $insertId  = $data['repayment_id'];

                $RepaymentAmounts = RepaymentAmountsModel::create([
                    'fk_repayment_id'    =>  $insertId, 
                    'fk_registration_id' =>  $value['registration_id'] ,
                     'fk_region_id'      =>  $value['fk_region_id'], 
                    'ysk_id'             =>  $yskId, 
                    'start_year'         =>  $startYear, 
                    'end_year'           =>  $EndYear, 
                    'repayment_amount'   =>  $repaymentAmount, 
                    'delay_charge'       =>  '0', 
                    'Cheque_bounce'      =>  '0', 
                    'ach_bounce'         =>  '0', 
                    'payment_status'     =>  $paymentStatus, 
                    'bounce_status'      =>  '0', 
                    'payment_completed'  =>  '0', 
                    'created_by'         =>  Auth::user()->fk_role_id,
                    ]);
            }

        }

    }

    public function RepaymentView($id){
        $RepaymentModel = RepaymentModel::select('repayments.*','regions.region_name','regions.region_code')
                    ->leftJoin('regions','regions.region_id','=','repayments.fk_region_id')
                    ->leftJoin('repayment_amounts','repayment_amounts.ysk_id','=','repayments.ysk_id')
                    ->where('repayments.ysk_id',$id)
                    ->get();
         

        $RepaymentAmountsModel = RepaymentAmountsModel::where('ysk_id',$id)->where('payment_completed','0')->get();
        $RepaymentAmountsPaid = RepaymentAmountsModel::where('ysk_id',$id)->where('payment_completed','1')->get();

        
            $registration = RegistrationModel::where('registrations.ysk_id',$id)
                    ->orWhere('registrations.pre_ysk_id',$id)
                    ->select('registrations.*',
                        'regions.region_name',
                        'regions.region_code',
                        'cities.city_name'
                        )
                    ->leftJoin('regions','regions.region_id','=','registrations.fk_region_id')
                    ->leftJoin('cities','cities.city_id','=','registrations.fk_city_id')
                    ->get();
        
              //dd($registration)  ;    
         return view('admin.repayment_view')->with(['RepaymentModel' =>$RepaymentModel,'RepaymentAmountsModel' =>$RepaymentAmountsModel,'registration'=>$registration,'RepaymentAmountsPaid'=>$RepaymentAmountsPaid]);
    }

    public function ChequeInfoSave(Request $Request )
    {
        
        RegistrationPaymentModel::create([
                    'fk_registration_id'        => Input::get('reg_id'),
                    'fk_reg_bank_name'          => Input::filled('reg_bank_name') ? Input::get('reg_bank_name'):'',  
                    'bank_amount'               => Input::get('bank_amount'),  
                    'ysk_member_bank_name'      => Input::filled('ysk_member_bank_name') ? Input::get('ysk_member_bank_name'):'',  
                    'branch_name'               => Input::filled('branch_name') ? Input::get('branch_name'):'',  
                    'cheque_number'             => Input::filled('cheque_number') ? Input::get('cheque_number'):'',  
                    'narration'                 => Input::filled('narration') ? Input::get('narration'):'',
                    'registration_payment_status' => '6',  
                    'status' => '1',  
                ]);
                $RepaymentAmountsModel = RepaymentAmountsModel::where('fk_registration_id',Input::get('reg_id'))
               ->where('payment_completed',0)
               ->get();
               foreach ($RepaymentAmountsModel as $key => $value) {
                
                   $data = RepaymentModel::where('repayment_id',$value['fk_repayment_id'])->update([
                    'payment_status'=> '2',
                ]);
                $insertId  = $data['repayment_id'];

                $RepaymentAmounts = RepaymentAmountsModel::where('repayment_amount_id',$value['repayment_amount_id'])->update([
                    'payment_status'    =>  '2', 
                    ]);
               }

        $responseData = array("success" => "1",'message'=>'Cheque Information Added sucessfuly');
        
        echo json_encode($responseData);
        exit;
    }

    public function FinalPaymentTotal(Request $Request )
    {   $total = array();
        $finaltotall =0;
        $id = Input::get('registeration_id');
       $RepaymentAmountsModel = RepaymentAmountsModel::where('fk_registration_id',$id)
       ->where('payment_completed',0)
       ->get();
        if(count($RepaymentAmountsModel)>0){
           foreach ($RepaymentAmountsModel as $key => $value) {

               $total[] = $value['repayment_amount'] + $value['delay_charge'] ;
           }
           $finaltotal = array_sum( $total);
           $finaltotall = $finaltotal+ $RepaymentAmountsModel[0]['Cheque_bounce'] + $RepaymentAmountsModel[0]['ach_bounce'];
        }
       $responseData = array("success" => "1",'finaltotal'=>$finaltotall);
        
        echo json_encode($responseData);
        exit;
    }

     /**
     * @author Reshmi Das
     * Date: 
     */
    public function multipleDeleteRepayment(Request $request)
    {
        RepaymentModel::whereIn('fk_registration_id',explode(",",$request->ids))->update(array('status' => '3',
            'payment_completed' => '3',
        ));
        RepaymentAmountsModel::whereIn('fk_registration_id',explode(",", $request->ids))->update(array('payment_completed' => '3'));

        Session::flash('success', 'Repayment has been deleted successfully.');
        return response()->json(['status'=>true,'message'=>"Repayment has been deleted successfully."]);
        
    }

    public function multipleAchPaid()
    { 
            $RepaymentAmountsModel = RepaymentAmountsModel::whereIn('fk_registration_id',explode(",",input::get('ids')))
               ->where('payment_completed',0)
               ->get();
               foreach ($RepaymentAmountsModel as $key => $value) {
                
                    $data = RepaymentModel::where('repayment_id',$value['fk_repayment_id'])->update([
                        'payment_status' => '1',
                        'payment_completed' => '1',
                        'ach_date' => input::get('start_date'),
                        'status' => '1',
                        'fk_bank_id' => input::get('bank_id'),
                    ]);
                    $insertId  = $data['repayment_id'];
                    $RepaymentAmounts = RepaymentAmountsModel::where('repayment_amount_id',$value['repayment_amount_id'])->update([
                        'payment_status' => '1',
                        'ach_date' => input::get('start_date'),
                        'payment_completed' => '1',
                        'fk_bank_id' => input::get('bank_id'),

                    ]);
                }
            $responseData = array("success" => "1");
            echo json_encode($responseData);
            exit;
        
    }

    public function multipleAchBounce()
    {   $clearenceDate = date('Y-m-d',strtotime(input::get('start_date')));
        $bankChargeDate = BankChargesModel::where('status','1')->where('end_date','0000-00-00')->first();

         if ($clearenceDate >= $bankChargeDate['start_date']) {
                $bankChargeData = BankChargesModel::where('status','1')->where('end_date','=','0000-00-00')->first();
            }
            elseif($bankChargeDate['start_date'] == '' || $clearenceDate <= $bankChargeDate['start_date']){
                $bankChargeData = BankChargesModel::where('status','1')->where('start_date','<=',$clearenceDate)->where('end_date','>=',$clearenceDate)->first();
            }
            $RepaymentAmountsModel = RepaymentAmountsModel::whereIn('fk_registration_id',explode(",",input::get('ids')))
               ->where('payment_completed',0)
               ->get();
               foreach ($RepaymentAmountsModel as $key => $value) {
                
                    $data = RepaymentModel::where('repayment_id',$value['fk_repayment_id'])->update([
                        'payment_status' => '1',
                        'payment_completed' => '0',
                        'bounce_status' => '1',
                        'ach_date' => input::get('start_date'),
                        'fk_bank_id' => input::get('bank_id'),
                    ]);
                    $insertId  = $data['repayment_id'];
                    $allchequeBouns = $bankChargeData['bank_charges_amount'] +$value['ach_bounce'];
                    $RepaymentAmounts = RepaymentAmountsModel::where('repayment_amount_id',$value['repayment_amount_id'])->update([
                        'payment_status' => '1',
                        'payment_completed' => '0',
                        'bounce_status' => '1',
                        'ach_date' => input::get('start_date'),
                        'fk_bank_id' => input::get('bank_id'),
                        'ach_bounce'    => $allchequeBouns,

                    ]);
                }
        /*RepaymentModel::whereIn('fk_registration_id',explode(",",input::get('ids')))->update(array(
            'payment_status' => '1',
            'payment_completed' => '0',
            'bounce_status' => '1',
            'ach_date' => input::get('start_date'),
        ));

        RepaymentAmountsModel::whereIn('fk_registration_id',explode(",", input::get('ids')))->update(array(
            'payment_status' => '1',
            'payment_completed' => '0',
            'bounce_status' => '1',
            'ach_date' => input::get('start_date'),
        ));*/

        $responseData = array("success" => "1");
        echo json_encode($responseData);
        exit;
        
    }


    public function ACHEXCEL(){
       
            $CustomerReportfinal[] =[
                'Customer Name'   =>'yu',
                'Order Number'    => 'uu',
                
            ];
        

         return response()->download(
            $this->export('deasd', 'fileName', 'csv')->getLocalPath(),
            $fileName,
            $CustomerReportfinal
        )->deleteFileAfterSend(true);
    }

     /**
    * @return \Illuminate\Support\Collection
    */
    /*public function importExport()
    {
       return view('import');
    }*/
    
    /**
    * @return \Illuminate\Support\Collection
    */
   /* public function export() 
    {   $id ='1';
        return Excel::download(new ExportUsers, 'users.xlsx');
    }
    */
    /**
    * @return \Illuminate\Support\Collection
    */
   /* public function import() 
    {
        Excel::import(new ImportUsers, request()->file('file'));
            
        return back();
    }*/

    public function RepaymentRegion(Request $Request){

        $RepaymentModelcmpleted = 
        RepaymentAmountsModel::where('start_year',Input::get('start_year'))->where('end_year',Input::get('end_year'))->where('fk_region_id',Input::get('region_id'))->sum('repayment_amount');
         $RepaymentModelpending = 
        RepaymentAmountsModel::where('start_year',Input::get('start_year'))->where('end_year',Input::get('end_year'))->where('fk_region_id',Input::get('region_id'))->where('payment_completed','0')->sum('repayment_amount');

        $responseData = array("success" => "1",'RepaymentModelcmpleted' => $RepaymentModelcmpleted,'RepaymentModelpending'=> $RepaymentModelpending );
        echo json_encode($responseData);
        exit;
        
    }
}
