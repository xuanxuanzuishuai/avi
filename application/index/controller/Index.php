<?php
namespace app\index\controller;

use think\Controller;
use app\index\model\Area;
use think\Db;
use app\index\model\Route;
use think\Request;
use app\index\model\Scenic;
use think\Auth;
use app\index\model\User;
use think\Session;
use app\index\model\Hotel;
use app\index\model\Comm;
class Index extends Controller
{
  
	public function judge(Request $request, Area $area, Scenic $scenic)
	{
		$id = $area->where('site', $request->param('name'))->value('id');
   		$result = Scenic::all(['cid' => $id]);
   		$name = $request->param('name');
   		$this->assign('area', $name);
   		//dump($name);
   		//die();
   		$this->assign('result', $result);
   		return $this->fetch();
	}

    public function index()
    {
        return $this->fetch();
    }


    public function tour(Area $area)
    {

    	$result = Db::table('a_area')->field('site')->select();
    	$result2 = Db::table('a_route')->field('good')->select();
    	$num = count($result);
    	$this->assign('sites', $result);
    	$this->assign('num', $num);
    	$this->assign('goods', $result2);
    	return $this->fetch();
    }

    public function detail(Request $request, Scenic $scenic)
    {
    		$id = $scenic->where('spot', $request->param('name'))->value('id');
    		$spot = Scenic::get($id);
    		$name = $spot->spot;
            $spot2 = $spot->spot;
    		$picture = $spot->picture;
    		$ticket = $spot->ticket;
    		$address = $spot->address;
    		$allowtime = $spot->allowtime; 
    		$pictures = json_decode($spot->pictures);
    		$balance = $spot->balance;
    		$brief = $spot->brief;
            $hot = $spot->hot;
    		$num = count($pictures);
            $cate = $spot->cate;
            $id = $spot->id;
            $this->assign('cate', $cate);
    		$this->assign('picture',$picture);
    		$this->assign('name',$name);
    		$this->assign('ticket',$ticket);
    		$this->assign('address', $address);
    		$this->assign('allowtime', $allowtime);
    		$this->assign('pictures', $pictures);
    		$this->assign('num', $num);
    		$this->assign('brief',$brief);
    		$this->assign('balance', $balance);
            $this->assign('hot', $hot);
            $this->assign('id', $id);
            $this->assign('spot2', $spot2);
    		return $this->fetch();
    }

    public function person(Request $request, User $user)
    {

            $username = Request::instance()->session('username');
            $user = User::get(['username' => $username]); 
            $str = $user->drivers;
            $record = $user->record;
            $arecord = json_decode($record, true);          
            if ($arecord) {
                foreach ($arecord as $value) 
                {
                  
                    if (empty($value[0])) 
                    {
                        $sim[] = $value;
                    } else {
                        $doub[] = $value;
                    }
                }
                
                
            }
            $array = json_decode($str, true);
            $count = count($array);
            rsort($array);
            if ($arecord)
            {
                $this->assign('arecord', $arecord);
                if (!empty($doub)) {
                     $this->assign('doub', $doub); 
                }
              
               if (!empty($sim)) {
               $this->assign('sim', $sim);
                }
            }
            
            $this->assign('array', $array);
            $this->assign('count', $count);
            return $this->fetch();
    }

   public function upload(User $user)
   {
        //  获取表单上传文件    例如上传了001.jpg
        $file = request()->file('image');
        //  移动到框架应用根目录/public/uploads/  目录下
        $info = $file->move(ROOT_PATH.'public'.DS.'uploads');
        if($info){
             $str =  '__UPLOADS__' . $info->getSaveName();
            $result = $user->save(
                ['icon' => $str],
                ['username' => Request::instance()->session('username')]
                );
            if ($result) {
                Session::set('icon', $str);
                $this->success('头像修改成功');
            } else {
                $this->error('上传失败');
            }

         }else{
           //  上传失败获取错误信息
             echo    $file->getError();
        }
    }

    public function personUpdate(Request $request, User $user)
    {
        $newusername = $request->param('username');
        $oldpassword = md5($request->param('oldpassword'));
        $newpassword = md5($request->param('newpassword'));
        $confirmpassword = md5($request->param('confirmpassword'));
        $email = $request->param('email');
        $signature = $request->param('signature');
        $password = User::where('username', Session::get('username'))->value('password');

        if ($password == $oldpassword && $newpassword == $confirmpassword) {

                
            $result = $user->save(
                ['username' => $newusername, 'password' => $newpassword, 'email' => $email, 'signature' => $signature],
                ['username' => Session::get('username')]
                );
            if ($result) {
                Session::set('username', $username);
                return '更新成功';
            } else {
                return '更新失败';
            }
        } else {
            return '密码输入错误';
        }

    }

    public function hoteljudge(Request $request, Scenic $scenic, Hotel $hotel)
    {
        $id = $scenic->where('spot', $request->param('name'))->value('id');
        $result = Hotel::all(['sid' => $id]);
        $scenic = $request->param('name');
        $this->assign('scenic', $scenic);
        //dump($name);
        //die();
        $this->assign('result', $result);
        return $this->fetch();
    }

    public function hoteldetail(Request $request, Hotel $hotel)
    {
        $id = $hotel->where('name', $request->param('name'))->value('id');
            $hotel = Hotel::get($id);
            $name = $hotel->name;
            $picture = $hotel->picture;
            $room = $hotel->room;
            $address = $hotel->address;
            $allowtime = $hotel->allowtime; 
            $pictures = json_decode($hotel->pictures);
            $balance = $hotel->balance;
            $brief = $hotel->brief;
            $hot = $hotel->hot;
            $num = count($pictures);
            $cate = $hotel->cate;
            $this->assign('cate', $cate);
            $this->assign('picture',$picture);
            $this->assign('name',$name);
            $this->assign('room',$room);
            $this->assign('address', $address);
            $this->assign('allowtime', $allowtime);
            $this->assign('pictures', $pictures);
            $this->assign('num', $num);
            $this->assign('brief',$brief);
            $this->assign('balance', $balance);
            $this->assign('hot', $hot);
            return $this->fetch();
    }

    public function people(Request $request, Hotel $hotel, Scenic $scenic)
    {
        $cate = $request->param('cate');
        $id = $request->param('id');
        $money = $request->param('money');
        $num = $request->param('num');
        $date = $request->param('date');
        if ($cate == '景点门票') {
            $spot = Scenic::get($id);
            $picture = $spot->picture;
            $ticket = $spot->ticket;
             $about = $spot->about;
            $spot = $spot->spot;
            $this->assign('cate', $cate);
            $this->assign('id', $id);
            $this->assign('money', $money);
            $this->assign('num',$num);
            $this->assign('ticket', $ticket);
            $this->assign('picture',$picture);
            $this->assign('spot', $spot);
            $this->assign('about',$about);
            $this->assign('date', $date);
        } else {
            $hotel = Hotel::get($id);
            $ticket = $hotel->room;
            $about = $hote->about;
             $picture = $hotle->picture;
             $spot = $hotel->name;
            $this->assign('cate', $cate);
            $this->assign('spot', $name);
            $this->assign('id', $id);
            $this->assign('money', $money);
            $this->assign('num',$num);
            $this->assign('ticket', $ticket);
             $this->assign('picture',$picture);
             $this->assign('about', $about);
             $this->assign('date', $date);
        }

        return $this->fetch();
    }

    public function doPeo(Request $request, Hotel $hotel, Scenic $scenic, Comm $comm)
    {
        $username = Request::instance()->session('username');
       $cate = $request->param('cate');
       $id = $request->param('id');
       $content = $request->param('content');
       if ($cate == '景点门票'){
            $sid = $id;
       } else {
            $hid = $id;
       }

       if ($sid) {
            $comm->sid = $sid;
            $comm->content = $content;
            $comm->username = $username;
           $result = $comm->save();
        } else {
             $comm->hid = $hid;
            $comm->content = $content;
            $comm->username = $username;
           $result =  $comm->save();
        }   
        if ($result) {

           $this->success('评论成功');
        } 
    }

    public function take(Request $request, Hotel $hotel, Scenic $scenic, Comm $comm)
    {
        $username = Request::instance()->session('username');

        $comm->where('username', $username)->find();
        $hid = $comm->hid;
        $sid = $comm->sid;
        $content = $comm->content;
        if ($hid){
            $hotel = Hotel::get($hid);
            $name = $hotel->name;
            $about = $hotel->about;
            $picture = $hotel->picture;
            $room = $hotel->room;
        } else {
             $hotel = Scenic::get($sid);
            $name = $hotel->name;
            $about = $hotel->about;
            $picture = $hotel->picture;
            $room = $hotel->room;
        }
             
             $this->assign('name', $name);
             $this->assign('about', $about);
             $this->assign('picture', $picture);
             $this->assign('content', $content);
             return $this->fetch();   
    }

}
