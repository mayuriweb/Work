<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Membership_model extends CI_Model {

    /**
     * @name string TABLE_NAME Holds the name of the table in use by this model
     */
    const TABLE_NAME = 'membership';

    /**
     * @name string PRI_INDEX Holds the name of the tables' primary index used in this model
     */
    const PRI_INDEX = 'membership_id';

    
    public function record_count() {
        $customer = $this->input->get('customer');
        $reg_no = $this->input->get('reg_no');

       

        if($customer){
            $this->db->like('customer',$customer);
            
        }
        if($reg_no){
            
           
            $this->db->like('reg_no',$reg_no);
           
        }
        
       
      $this->db->order_by(self::PRI_INDEX,'desc');
        $query = $this->db->get(self::TABLE_NAME)->result();
        return  count($query);
    }

    public function fetch_data($limit, $start) {
       $customer = $this->input->get('customer');
        $reg_no = $this->input->get('reg_no');
        if($customer){
            $this->db->like('customer',$customer);
            
        }
        if($reg_no){
            
           
            $this->db->like('reg_no',$reg_no);
           
        }
       
              
        $this->db->limit($limit, $start);
        $this->db->order_by(self::PRI_INDEX,'desc');
        $query = $this->db->get(self::TABLE_NAME);

        if ($query->num_rows() > 0) {
            foreach ($query->result() as $row) {
                $data[] = $row;
            }
            return $data;
        }
        return false;
   }

   
     public function get($id){

         $ret = $this->db->get_where(self::TABLE_NAME,array('membership_id'=>$id))->row();
         if(!$ret){
            show_404();
           } 
         return $ret;
       }
     
    public function insert(Array $data) {
        if ($this->db->insert(self::TABLE_NAME, $data)) {
            return $this->db->insert_id();
        } else {
            return false;
        }
    }

    
    public function update(Array $data, $where = array()) {
            if (!is_array($where)) {
                $where = array(self::PRI_INDEX => $where);
            }
        $this->db->update(self::TABLE_NAME, $data, $where);
        return $this->db->affected_rows();
    }

      
    public function membershipdelete($id) {
        
        $this->db->where(self::PRI_INDEX, $id);
    
        $this->db->delete(self::TABLE_NAME);
        return $this->db->affected_rows();
    }
   
}

?>